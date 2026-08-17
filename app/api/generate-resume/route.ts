import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { resumeDataSchema } from "@/schemas/resume.schema";
import { getAIProvider } from "@/lib/ai";
import { aiErrorResponse } from "@/lib/ai/errorResponse";
import { rateLimiter } from "@/lib/security/rateLimit";
import { toAIResumeContent } from "@/lib/utils/resumeContent";

/**
 * POST /api/generate-resume
 * Recebe o ResumeData atual (dados brutos do formulário) e devolve um
 * AIResumeContent gerado/validado. Não recebe nem devolve personalInfo,
 * settings, HTML ou CSS — só o conteúdo (seção 2).
 */
const requestSchema = z.object({ resume: resumeDataSchema });

export async function POST(request: NextRequest) {
  // Fase 8 troca este limitador sempre-permite por um de verdade (Upstash).
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
    const result = await provider.generateResume({
      rawData: toAIResumeContent(parsed.data.resume),
      hasProfessionalExperience: parsed.data.resume.hasProfessionalExperience,
    });
    return NextResponse.json(result);
  } catch (err) {
    return aiErrorResponse(err);
  }
}
