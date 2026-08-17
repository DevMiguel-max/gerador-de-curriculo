interface TemplatePageProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Simula a página A4 no preview (seção 49: "o preview deve representar
 * o PDF real da melhor forma possível"). Usa mm/pt para casar com a
 * geração real do PDF na Fase 7. Cada template injeta sua própria
 * fonte/cor via `className` — este componente só define as dimensões.
 */
export function TemplatePage({ children, className = "" }: TemplatePageProps) {
  return (
    <div
      className={`mx-auto w-[210mm] min-h-[297mm] bg-white ${className}`}
      style={{ fontSize: "10.5pt", lineHeight: 1.45 }}
    >
      {children}
    </div>
  );
}
