interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-6">
      <header className="mb-5">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}
