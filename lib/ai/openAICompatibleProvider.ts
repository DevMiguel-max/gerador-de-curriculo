import { aiResumeContentSchema, type AIResumeContent } from "@/schemas/resume.schema";
import { RESUME_AI_SYSTEM_PROMPT, buildUserDataMessage } from "@/lib/ai/prompts";
import type {
  AIProvider,
  AIProviderResult,
  GenerateResumeInput,
  JobAnalysisResult,
  OptimizeResumeInput,
} from "@/lib/ai/provider";
import { AIProviderError } from "@/lib/ai/provider";

/**
 * Decisão de implementação (Fase 5): assume um endpoint compatível com
 * o formato "OpenAI Chat Completions" (`POST {AI_BASE_URL}/chat/completions`).
 * É o formato mais comum entre provedores (inclusive NVIDIA Integrate),
 * e é exatamente por isso que a interface `AIProvider` existe — se o seu
 * provedor usa outro formato, esta é a ÚNICA classe que precisa mudar.
 */

const REQUEST_TIMEOUT_MS = 30_000;

const OUTPUT_SCHEMA_DESCRIPTION = `Formato de saída esperado (JSON, sem nenhum texto fora dele):
{
  "professionalSummary": string,
  "objective": string,
  "experiences": [{ "id": string, "company": string, "position": string, "location"?: string, "startDate": string, "endDate"?: string, "current": boolean, "description": string, "achievements": string[] }],
  "education": [{ "id": string, "institution": string, "course": string, "level": string, "startDate": string, "endDate"?: string, "current": boolean, "description"?: string }],
  "courses": [{ "id": string, "name": string, "institution": string, "date": string }],
  "certifications": [{ "id": string, "name": string, "institution": string, "date": string }],
  "skills": [{ "id": string, "name": string, "category": "technical"|"behavioral"|"tool"|"technology"|"other" }],
  "languages": [{ "id": string, "language": string, "proficiency": "basic"|"intermediate"|"advanced"|"fluent"|"native" }],
  "projects": [{ "id": string, "name": string, "description": string, "technologies": string[] }],
  "volunteering": [{ "id": string, "organization": string, "role": string, "period": string }],
  "awards": [{ "id": string, "name": string, "institution": string, "date": string }]
}
Preserve os campos "id" exatamente como recebidos nos dados do usuário — nunca gere novos.
Nunca inclua um array com itens que o usuário não forneceu.`;

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
}

async function callChatCompletion(userMessage: string): Promise<unknown> {
  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;

  if (!baseUrl || !apiKey || !model) {
    throw new AIProviderError(
      "IA não configurada (AI_BASE_URL/AI_API_KEY/AI_MODEL ausentes).",
      "upstream_error",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `${RESUME_AI_SYSTEM_PROMPT}\n\n${OUTPUT_SCHEMA_DESCRIPTION}`,
          },
          { role: "user", content: userMessage },
        ],
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new AIProviderError("Tempo limite excedido ao contatar a IA.", "timeout");
    }
    throw new AIProviderError("Falha de rede ao contatar a IA.", "upstream_error");
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429) {
    throw new AIProviderError("Limite de requisições da IA atingido.", "rate_limit");
  }
  if (!response.ok) {
    throw new AIProviderError(`IA respondeu com erro (${response.status}).`, "upstream_error");
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new AIProviderError("Resposta da IA veio vazia.", "invalid_json");
  }

  try {
    // remove eventuais blocos ```json que alguns modelos ainda incluem
    const cleaned = rawContent.replace(/^```json\s*|```$/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new AIProviderError("A IA não retornou um JSON válido.", "invalid_json");
  }
}

function validateOrThrow(raw: unknown): AIResumeContent {
  const parsed = aiResumeContentSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AIProviderError(
      "JSON da IA não corresponde ao schema esperado.",
      "invalid_json",
    );
  }
  return parsed.data;
}

export const openAICompatibleProvider: AIProvider = {
  async generateResume(input: GenerateResumeInput): Promise<AIProviderResult> {
    const userMessage = buildUserDataMessage(
      JSON.stringify({
        hasProfessionalExperience: input.hasProfessionalExperience,
        ...input.rawData,
      }),
    );
    const raw = await callChatCompletion(userMessage);
    return { content: validateOrThrow(raw), validated: true };
  },

  async optimizeResume(input: OptimizeResumeInput): Promise<AIProviderResult> {
    const context = {
      currentContent: input.currentContent,
      targetJob: input.targetJob ?? null,
      jobDescription: input.jobDescription ?? null,
      instructions:
        "Reescreva/profissionalize o conteúdo abaixo preservando os fatos. Se targetJob/jobDescription " +
        "estiverem presentes, adapte o resumo e reorganize habilidades por relevância — mas NUNCA adicione " +
        "uma competência que não esteja em currentContent, mesmo que a vaga peça.",
    };
    const raw = await callChatCompletion(buildUserDataMessage(JSON.stringify(context)));
    return { content: validateOrThrow(raw), validated: true };
  },

  async analyzeJob(jobDescription: string): Promise<JobAnalysisResult> {
    const raw = await callChatCompletion(
      buildUserDataMessage(
        JSON.stringify({
          task: "extrair_palavras_chave",
          jobDescription,
          formato_saida: '{ "keywords": string[], "requiredSkills": string[], "seniority"?: string }',
        }),
      ),
    );
    if (
      typeof raw !== "object" ||
      raw === null ||
      !Array.isArray((raw as { keywords?: unknown }).keywords)
    ) {
      throw new AIProviderError("Resposta de análise de vaga inválida.", "invalid_json");
    }
    const result = raw as JobAnalysisResult;
    return {
      keywords: result.keywords ?? [],
      requiredSkills: result.requiredSkills ?? [],
      seniority: result.seniority,
    };
  },

  async suggestImprovements(input: OptimizeResumeInput): Promise<string[]> {
    const raw = await callChatCompletion(
      buildUserDataMessage(
        JSON.stringify({
          task: "sugestoes_texto_livre",
          currentContent: input.currentContent,
          targetJob: input.targetJob ?? null,
          jobDescription: input.jobDescription ?? null,
          formato_saida: "string[] — sugestões, nunca aplicadas automaticamente",
        }),
      ),
    );
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string") : [];
  },
};
