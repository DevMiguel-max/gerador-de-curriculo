import clsx from "clsx";
import { FORM_STEPS, type FormStepId } from "@/lib/store/resumeStore";

const STEP_LABELS: Record<FormStepId, string> = {
  "personal-info": "Dados pessoais",
  objective: "Objetivo",
  experience: "Experiência",
  education: "Formação",
  "courses-certifications": "Cursos",
  skills: "Habilidades",
  languages: "Idiomas",
  projects: "Projetos",
  links: "Links",
  "target-job": "Vaga desejada",
};

interface StepIndicatorProps {
  current: FormStepId;
  onSelect: (step: FormStepId) => void;
  furthestIndex: number;
}

export function StepIndicator({ current, onSelect, furthestIndex }: StepIndicatorProps) {
  const currentIndex = FORM_STEPS.indexOf(current);
  return (
    <nav aria-label="Etapas do formulário" className="w-full">
      <ol className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {FORM_STEPS.map((step, index) => {
          const isCurrent = step === current;
          const isDone = index < currentIndex;
          const isReachable = index <= furthestIndex;
          return (
            <li key={step} className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => onSelect(step)}
                aria-current={isCurrent ? "step" : undefined}
                className={clsx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors duration-150",
                  isCurrent && "bg-ink text-white",
                  !isCurrent && isDone && "bg-accent/15 text-accent-ink",
                  !isCurrent && !isDone && "bg-bg text-ink-muted",
                  !isReachable && "cursor-not-allowed opacity-50",
                )}
              >
                {index + 1}
              </button>
              <span
                className={clsx(
                  "hidden text-xs sm:inline",
                  isCurrent ? "font-medium text-ink" : "text-ink-muted",
                )}
              >
                {STEP_LABELS[step]}
              </span>
              {index < FORM_STEPS.length - 1 && (
                <span className="mx-1 h-px w-3 shrink-0 bg-border sm:mx-2 sm:w-4" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { STEP_LABELS };
