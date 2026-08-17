/**
 * Rate limiting das rotas de IA e de geração de PDF (Fase 8, seção 58).
 *
 * Recomendação: @upstash/ratelimit + Vercel KV em produção (compatível
 * com serverless/edge na Vercel, sem servidor dedicado). Para dev local
 * sem Redis, um limitador em memória basta.
 *
 * Por enquanto esta é só a interface — nenhuma rota deve chamar
 * a IA ou gerar PDF sem passar por aqui a partir da Fase 8.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
}

// TODO (Fase 8): substituir por implementação real (Upstash em produção,
// limitador em memória em desenvolvimento).
export const rateLimiter: RateLimiter = {
  async check(_identifier: string) {
    return { allowed: true, remaining: Infinity, resetAt: 0 };
  },
};
