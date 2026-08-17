"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { FORM_STEPS, useResumeStore } from "@/lib/store/resumeStore";
import { StepIndicator } from "@/components/form/StepIndicator";
import { STEP_COMPONENTS } from "@/components/form/steps";
import { Button } from "@/components/ui/Button";

export function FormWizard() {
  const router = useRouter();
  const currentStep = useResumeStore((s) => s.currentStep);
  const setStep = useResumeStore((s) => s.setStep);
  const goNext = useResumeStore((s) => s.goNext);
  const goBack = useResumeStore((s) => s.goBack);

  // maior índice já visitado nesta sessão — controla quais passos do
  // indicador já são clicáveis (não deixa "pular" etapas não vistas).
  const [furthestIndex, setFurthestIndex] = useState(() => FORM_STEPS.indexOf(currentStep));

  const currentIndex = FORM_STEPS.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === FORM_STEPS.length - 1;

  const progressLabel = useMemo(
    () => `Etapa ${currentIndex + 1} de ${FORM_STEPS.length}`,
    [currentIndex],
  );

  function handleSelect(step: (typeof FORM_STEPS)[number]) {
    setStep(step);
    setFurthestIndex((prev) => Math.max(prev, FORM_STEPS.indexOf(step)));
  }

  function handleNext() {
    goNext();
    setFurthestIndex((prev) => Math.max(prev, currentIndex + 1));
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          {progressLabel}
        </span>
        <StepIndicator current={currentStep} onSelect={handleSelect} furthestIndex={furthestIndex} />
      </div>

      <StepComponent />

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button type="button" variant="ghost" onClick={goBack} disabled={isFirst}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        {isLast ? (
          <Button type="button" variant="primary" onClick={() => router.push("/preview")}>
            Ver preview
            <Eye className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" variant="primary" onClick={handleNext}>
            Avançar
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
