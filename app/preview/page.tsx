"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useResumeHydration } from "@/lib/store/useResumeHydration";
import { TemplateSwitcher } from "@/components/preview/TemplateSwitcher";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { OptimizeWithAI } from "@/components/preview/OptimizeWithAI";
import { Button } from "@/components/ui/Button";

export default function PreviewPage() {
  const hasHydrated = useResumeHydration();

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs text-ink-muted">Carregando...</span>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Editar dados
        </Link>
        <div className="flex items-start gap-2">
          <OptimizeWithAI />
          <Button variant="primary" disabled title="Chega na Fase 7">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-ink">Template</h2>
        <TemplateSwitcher />
      </div>

      <ResumePreview />
    </main>
  );
}
