import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { resumeDataSchema } from "@/schemas/resume.schema";
import { getAIProvider } from "@/lib/ai";
import { aiErrorResponse } from "@/lib/ai/errorResponse";
import { rateLimiter } from "@/lib/security/rateLimit";
import { toAIResumeContent } from "@/lib/utils/resumeContent";
import type { JobAnalysisResult } from "@/lib/ai/provider";

/**
 * POST /api/optimize-resume
 * Reescreve/profissionaliza o conteúdo atual (seção 31). Quando
 * `jobDescription` está preenchido, também roda a adaptação à vaga da
 * Fase 6 (seção 34): extrai palavras-chave/competências e devolve
 * sugestões em texto livre — nunca aplicadas automaticamente ao
 * currículo (seção 35). As três chamadas à IA rodam em paralelo.
 */
const requestSchema = z.object({ resume: resumeDataSchema });

export async function POST(request: NextRequest) {
  const limit = await rateLimiter.check(request.headers.get("x-forwarded-for") ?? "anonymous");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Limite de solicitações atingido." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados do currículo inválidos." }, { status: 400 });
  }

  try {
    const provider = getAIProvider();
    const { resume } = parsed.data;
    const currentContent = toAIResumeContent(resume);
    const targetJob = resume.targetJob || undefined;
    const jobDescription = resume.jobDescription || undefined;

    const optimizePromise = provider.optimizeResume({ currentContent, targetJob, jobDescription });
    // seção 34-35: só roda análise/sugestões de vaga se houver descrição colada.
    const jobAnalysisPromise: Promise<JobAnalysisResult | undefined> = jobDescription
      ? provider.analyzeJob(jobDescription)
      : Promise.resolve(undefined);
    const suggestionsPromise: Promise<string[] | undefined> = jobDescription
      ? provider.suggestImprovements({ currentContent, targetJob, jobDescription })
      : Promise.resolve(undefined);

    const [result, jobAnalysis, suggestions] = await Promise.all([
      optimizePromise,
      jobAnalysisPromise,
      suggestionsPromise,
    ]);

    return NextResponse.json({ ...result, jobAnalysis, suggestions });
  } catch (err) {
    return aiErrorResponse(err);
  }
}
