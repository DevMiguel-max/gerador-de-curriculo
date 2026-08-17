"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { AbsenceCheckbox } from "@/components/ui/AbsenceCheckbox";

export function Step10TargetJob() {
  const targetJob = useResumeStore((s) => s.resume.targetJob);
  const jobDescription = useResumeStore((s) => s.resume.jobDescription);
  const additionalInfo = useResumeStore((s) => s.resume.additionalInfo);
  const setTargetJob = useResumeStore((s) => s.setTargetJob);
  const setJobDescription = useResumeStore((s) => s.setJobDescription);
  const setAdditionalInfo = useResumeStore((s) => s.setAdditionalInfo);

  const additionalAbsent = additionalInfo.status === "not_available";

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Vaga desejada"
        description="Cole a descrição da vaga que você quer — isso será usado na Fase 6 para adaptar seu currículo sem inventar competências que você não possui."
      >
        <div className="flex flex-col gap-5">
          <TextField
            label="Cargo desejado"
            value={targetJob}
            onChange={(e) => setTargetJob(e.target.value)}
            placeholder="Ex.: Técnico de Automação"
            optional
          />
          <TextArea
            label="Descrição da vaga"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Cole aqui o texto da vaga..."
            maxLength={4000}
            optional
          />
        </div>
      </SectionCard>

      <SectionCard title="Informações adicionais">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">Algo mais que não coube nas etapas anteriores?</span>
          <AbsenceCheckbox
            label="Nada a adicionar"
            checked={additionalAbsent}
            onChange={(checked) =>
              setAdditionalInfo({ status: checked ? "not_available" : "not_provided", value: null })
            }
          />
        </div>
        {!additionalAbsent && (
          <div className="mt-3">
            <TextArea
              label=""
              aria-label="Informações adicionais"
              value={additionalInfo.value ?? ""}
              onChange={(e) =>
                setAdditionalInfo({ status: "provided", value: e.target.value })
              }
              maxLength={2000}
            />
          </div>
        )}
      </SectionCard>
    </div>
  );
}
