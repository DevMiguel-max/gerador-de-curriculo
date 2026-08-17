import type { AIResumeContent } from "@/schemas/resume.schema";

/**
 * Contrato que qualquer provedor de IA deve implementar.
 *
 * NADA no resto do app deve importar um SDK de IA diretamente — só esta
 * interface. A implementação concreta (chamando AI_BASE_URL/AI_MODEL via
 * fetch) entra na Fase 5. Isso é o que torna trivial trocar de provedor
 * sem tocar em formulário, templates ou rotas.
 *
 * Todo método deve:
 *  - tratar os dados do usuário como DADOS, nunca como instruções
 *    (ver prompts.ts e seção 37 — prompt injection);
 *  - retornar apenas o subconjunto AIResumeContent (nunca personalInfo,
 *    settings, HTML ou CSS — seção 2);
 *  - nunca inventar empresas, cargos, datas, certificações, tecnologias
 *    ou anos de experiência (seção 32).
 */
export interface AIProvider {
  /** Gera o conteúdo inicial do currículo a partir dos dados brutos do formulário. */
  generateResume(input: GenerateResumeInput): Promise<AIProviderResult>;

  /** Reescreve/profissionaliza conteúdo já existente sem inventar fatos novos. */
  optimizeResume(input: OptimizeResumeInput): Promise<AIProviderResult>;

  /** Extrai palavras-chave e competências relevantes de uma descrição de vaga. */
  analyzeJob(jobDescription: string): Promise<JobAnalysisResult>;

  /** Sugestões (texto livre, não aplicadas automaticamente) — ex.: "considere adicionar NR10". */
  suggestImprovements(input: OptimizeResumeInput): Promise<string[]>;
}

export interface GenerateResumeInput {
  /** Conteúdo bruto já preenchido no formulário — mesmo formato de saída (arrays simples). */
  rawData: AIResumeContent;
  hasProfessionalExperience: boolean | null;
}

export interface OptimizeResumeInput {
  /** Mesmo formato de saída (AIResumeContent) — arrays simples, sem o wrapper ListField. As rotas fazem a conversão a partir do ResumeData. */
  currentContent: AIResumeContent;
  targetJob?: string;
  jobDescription?: string;
}

export interface AIProviderResult {
  content: AIResumeContent;
  /** true se o Zod validou o JSON de primeira; false se precisou de fallback/retry (Fase 5). */
  validated: boolean;
}

export interface JobAnalysisResult {
  keywords: string[];
  requiredSkills: string[];
  seniority?: string;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly cause?: "timeout" | "invalid_json" | "rate_limit" | "upstream_error",
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
