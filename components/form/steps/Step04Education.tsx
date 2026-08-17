"use client";

import { Plus, Trash2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

const LEVEL_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "Ensino Fundamental", label: "Ensino Fundamental" },
  { value: "Ensino Médio", label: "Ensino Médio" },
  { value: "Técnico", label: "Técnico" },
  { value: "Graduação", label: "Graduação" },
  { value: "Pós-graduação", label: "Pós-graduação" },
  { value: "Mestrado", label: "Mestrado" },
  { value: "Doutorado", label: "Doutorado" },
];

export function Step04Education() {
  const education = useResumeStore((s) => s.resume.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  return (
    <SectionCard
      title="Formação"
      description="Do ensino médio à pós-graduação — o que for relevante para a vaga desejada."
    >
      <div className="flex flex-col gap-4">
        {education.length === 0 && (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-ink-muted">
            Nenhuma formação adicionada ainda.
          </p>
        )}
        {education.map((edu, index) => (
          <div key={edu.id} className="rounded-md border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-ink-muted">Formação {index + 1}</span>
              <IconButton
                icon={Trash2}
                label="Remover formação"
                variant="danger"
                onClick={() => removeEducation(edu.id)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Instituição"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              />
              <TextField
                label="Curso"
                value={edu.course}
                onChange={(e) => updateEducation(edu.id, { course: e.target.value })}
              />
              <Select
                label="Nível"
                options={LEVEL_OPTIONS}
                value={edu.level}
                onChange={(e) => updateEducation(edu.id, { level: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Início"
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                />
                <TextField
                  label="Fim"
                  type="month"
                  value={edu.endDate ?? ""}
                  disabled={edu.current}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                />
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={edu.current}
                onChange={(e) =>
                  updateEducation(edu.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : edu.endDate,
                  })
                }
                className="h-4 w-4 rounded-sm border-border accent-accent"
              />
              Curso em andamento
            </label>
            <div className="mt-3">
              <TextArea
                label="Descrição"
                value={edu.description ?? ""}
                onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                optional
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addEducation} className="self-start">
          <Plus className="h-4 w-4" />
          Adicionar formação
        </Button>
      </div>
    </SectionCard>
  );
}
