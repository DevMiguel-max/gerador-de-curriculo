import type { ResumeData } from "@/types/resume";

export interface TemplateProps {
  resume: ResumeData;
}

export type TemplateComponent = (props: TemplateProps) => JSX.Element;

/**
 * Nota de design: os templates aqui embaixo formam um sistema visual
 * DELIBERADAMENTE separado da UI do produto (que usa os tokens em
 * tailwind.config.ts — tinta/azul-marinho + acento dourado). Um
 * currículo não deveria "parecer feito nesta ferramenta" — cada
 * template tem sua própria identidade tipográfica, adequada ao
 * contexto profissional a que se propõe (ver seções 41-46 do
 * briefing). Por isso os componentes abaixo usam valores de cor
 * arbitrários do Tailwind (`text-[#...]`) em vez de `text-ink`/
 * `text-accent`.
 */
