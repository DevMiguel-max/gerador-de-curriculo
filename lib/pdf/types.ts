import type { ResumeData } from "@/types/resume";

/**
 * Contrato do gerador de PDF (Fase 7).
 *
 * Recomendação (ver README.md, seção de decisões técnicas): @react-pdf/renderer.
 * Gera PDF vetorial real (texto selecionável, links clicáveis, paginação
 * A4 nativa) sem depender de headless browser — evita os problemas de
 * tamanho/cold-start do Puppeteer em serverless (Vercel).
 *
 * Trade-off consciente: como @react-pdf/renderer não renderiza HTML/CSS,
 * cada template precisará de uma versão "para tela" (componentes React
 * normais, em components/templates) e uma versão "para PDF" (componentes
 * @react-pdf/renderer, em templates/<Nome>). As duas devem consumir os
 * MESMOS tokens de design (cores, tipografia, espaçamento) de um módulo
 * compartilhado para não divergirem visualmente.
 */
export interface PdfGenerator {
  generate(resume: ResumeData): Promise<Uint8Array>;
}

export interface PdfGenerationOptions {
  templateId: ResumeData["settings"]["templateId"];
  /** Para debug/local apenas — nunca logar o ResumeData completo (seção 68). */
  debug?: boolean;
}
