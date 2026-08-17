import { NextResponse } from "next/server";

/**
 * POST /api/generate-pdf
 * Recebe um ResumeData validado e devolve os bytes do PDF A4 gerado via
 * @react-pdf/renderer (ver lib/pdf/types.ts). Implementação real na Fase 7.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Não implementado — chega na Fase 7 (PDF)." },
    { status: 501 },
  );
}
