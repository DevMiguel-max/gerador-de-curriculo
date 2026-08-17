"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { useResumeHydration } from "@/lib/store/useResumeHydration";
import { FormWizard } from "@/components/form/FormWizard";
import { Button } from "@/components/ui/Button";

export default function CreatePage() {
  const hasHydrated = useResumeHydration();
  const resume = useResumeStore((s) => s.resume);
  const resetDraft = useResumeStore((s) => s.resetDraft);
  const [draftChoiceMade, setDraftChoiceMade] = useState(false);

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs text-ink-muted">Carregando...</span>
      </main>
    );
  }

  const hasDraftContent =
    resume.personalInfo.fullName.trim() !== "" || resume.updatedAt !== resume.createdAt;

  if (hasDraftContent && !draftChoiceMade) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-white p-6 text-center">
          <h1 className="font-display text-xl text-ink">Encontramos um rascunho salvo</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Parece que você já tinha começado um currículo. Quer continuar de onde parou?
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="primary" onClick={() => setDraftChoiceMade(true)}>
              Continuar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                resetDraft();
                setDraftChoiceMade(true);
              }}
            >
              Começar novo
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <FormWizard />
    </main>
  );
}
