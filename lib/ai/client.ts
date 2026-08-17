"use client";

import type { ResumeData } from "@/types/resume";
import type { AIResumeContent } from "@/schemas/resume.schema";
import type { JobAnalysisResult } from "@/lib/ai/provider";

export class AIRequestError extends Error {}

interface OptimizeResumeResponse {
  content: AIResumeContent;
  validated: boolean;
  jobAnalysis?: JobAnalysisResult;
  suggestions?: string[];
}

async function postJson<T>(route: string, resume: ResumeData): Promise<T> {
  const response = await fetch(`/api/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AIRequestError(data?.error ?? "Não foi possível concluir a solicitação.");
  }
  return data as T;
}

export async function generateResumeContent(resume: ResumeData): Promise<AIResumeContent> {
  const data = await postJson<{ content: AIResumeContent }>("generate-resume", resume);
  return data.content;
}

/**
 * Se `resume.jobDescription` estiver preenchido, a resposta também traz
 * `jobAnalysis` (palavras-chave/competências da vaga) e `suggestions`
 * (texto livre, nunca aplicado automaticamente — seção 35).
 */
export function optimizeResumeContent(resume: ResumeData): Promise<OptimizeResumeResponse> {
  return postJson<OptimizeResumeResponse>("optimize-resume", resume);
}
