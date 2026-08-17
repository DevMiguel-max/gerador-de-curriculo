import { NextResponse } from "next/server";
import { AIProviderError } from "@/lib/ai/provider";

const STATUS_BY_CAUSE: Record<NonNullable<AIProviderError["cause"]>, number> = {
  timeout: 504,
  invalid_json: 502,
  rate_limit: 429,
  upstream_error: 502,
};

const MESSAGE_BY_CAUSE: Record<NonNullable<AIProviderError["cause"]>, string> = {
  timeout: "A IA demorou demais para responder. Tente novamente.",
  invalid_json: "A IA retornou uma resposta inesperada. Tente novamente.",
  rate_limit: "Muitas solicitações à IA em pouco tempo. Aguarde um instante.",
  upstream_error: "Não foi possível falar com a IA agora. Tente novamente em instantes.",
};

export function aiErrorResponse(err: unknown): NextResponse {
  if (err instanceof AIProviderError) {
    const cause = err.cause ?? "upstream_error";
    return NextResponse.json({ error: MESSAGE_BY_CAUSE[cause] }, { status: STATUS_BY_CAUSE[cause] });
  }
  // Erro não previsto: log só do lado do servidor (sem dados pessoais — seção 68),
  // resposta genérica para o cliente.
  console.error("Erro inesperado na rota de IA:", err instanceof Error ? err.message : err);
  return NextResponse.json({ error: "Erro inesperado ao processar a solicitação." }, { status: 500 });
}
