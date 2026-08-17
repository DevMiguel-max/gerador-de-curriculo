"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextArea } from "@/components/ui/TextArea";

export function Step02Objective() {
  const professionalSummary = useResumeStore((s) => s.resume.professionalSummary);
  const objective = useResumeStore((s) => s.resume.objective);
  const setProfessionalSummary = useResumeStore((s) => s.setProfessionalSummary);
  const setObjective = useResumeStore((s) => s.setObjective);

  return (
    <SectionCard
      title="Objetivo profissional"
      description="Um parágrafo curto sobre quem você é profissionalmente. Pode escrever de forma informal — a IA pode ajudar a lapidar isso mais adiante."
    >
      <div className="flex flex-col gap-5">
        <TextArea
          label="Resumo profissional"
          value={professionalSummary}
          onChange={(e) => setProfessionalSummary(e.target.value)}
          placeholder="Ex.: Técnico de automação com foco em manutenção industrial e leitura de diagramas elétricos..."
          maxLength={600}
          optional
        />
        <TextArea
          label="Objetivo"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Ex.: Busco uma posição em automação industrial onde eu possa aplicar meus conhecimentos em CLP e comandos elétricos."
          maxLength={300}
          optional
        />
      </div>
    </SectionCard>
  );
}
