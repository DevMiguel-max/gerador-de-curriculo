"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { IconButton } from "@/components/ui/IconButton";

export function Step03Experience() {
  const hasExperience = useResumeStore((s) => s.resume.hasProfessionalExperience);
  const experiences = useResumeStore((s) => s.resume.experiences);
  const setHasProfessionalExperience = useResumeStore((s) => s.setHasProfessionalExperience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const moveExperience = useResumeStore((s) => s.moveExperience);

  return (
    <SectionCard title="Experiência profissional">
      <div className="flex flex-col gap-2 sm:flex-row">
        <ChoiceCard
          title="Sim, possuo experiência"
          selected={hasExperience === true}
          onSelect={() => setHasProfessionalExperience(true)}
        />
        <ChoiceCard
          title="Não, estou procurando meu primeiro emprego"
          selected={hasExperience === false}
          onSelect={() => setHasProfessionalExperience(false)}
        />
      </div>

      {hasExperience === false && (
        <p className="mt-4 rounded-md bg-accent/[0.06] px-4 py-3 text-sm text-ink">
          Sem problema — vamos dar mais destaque à sua formação, cursos,
          habilidades e projetos nas próximas etapas.
        </p>
      )}

      {hasExperience === true && (
        <div className="mt-5 flex flex-col gap-4">
          {experiences.length === 0 && (
            <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-ink-muted">
              Nenhuma experiência adicionada ainda.
            </p>
          )}
          {experiences.map((exp, index) => (
            <div key={exp.id} className="rounded-md border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs text-ink-muted">
                  Experiência {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={ChevronUp}
                    label="Mover para cima"
                    disabled={index === 0}
                    onClick={() => moveExperience(exp.id, "up")}
                  />
                  <IconButton
                    icon={ChevronDown}
                    label="Mover para baixo"
                    disabled={index === experiences.length - 1}
                    onClick={() => moveExperience(exp.id, "down")}
                  />
                  <IconButton
                    icon={Trash2}
                    label="Remover experiência"
                    variant="danger"
                    onClick={() => removeExperience(exp.id)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Empresa"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
                <TextField
                  label="Cargo"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                />
                <TextField
                  label="Local"
                  value={exp.location ?? ""}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  optional
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Início"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                  <TextField
                    label="Fim"
                    type="month"
                    value={exp.endDate ?? ""}
                    disabled={exp.current}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  />
                </div>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(exp.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : exp.endDate,
                    })
                  }
                  className="h-4 w-4 rounded-sm border-border accent-accent"
                />
                Trabalho aqui atualmente
              </label>
              <div className="mt-3">
                <TextArea
                  label="Descrição"
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  placeholder="Descreva suas responsabilidades com suas próprias palavras — a IA pode ajudar a profissionalizar isso depois."
                  maxLength={1500}
                />
              </div>
              <div className="mt-3">
                <TextArea
                  label="Principais resultados/conquistas"
                  value={exp.achievements.join("\n")}
                  onChange={(e) =>
                    updateExperience(exp.id, {
                      achievements: e.target.value.split("\n"),
                    })
                  }
                  hint="Um por linha."
                  optional
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addExperience} className="self-start">
            <Plus className="h-4 w-4" />
            Adicionar experiência
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
