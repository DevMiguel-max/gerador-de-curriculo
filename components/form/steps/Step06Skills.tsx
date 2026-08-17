"use client";

import { Trash2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { generateId } from "@/lib/utils/id";
import type { SkillCategory } from "@/types/resume";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { IconButton } from "@/components/ui/IconButton";
import { ListFieldSection } from "@/components/form/ListFieldSection";

const CATEGORY_OPTIONS: { value: SkillCategory; label: string }[] = [
  { value: "technical", label: "Técnica" },
  { value: "behavioral", label: "Comportamental" },
  { value: "tool", label: "Ferramenta" },
  { value: "technology", label: "Tecnologia" },
  { value: "other", label: "Outra" },
];

export function Step06Skills() {
  const skills = useResumeStore((s) => s.resume.skills);
  const setListStatus = useResumeStore((s) => s.setListStatus);
  const addListItem = useResumeStore((s) => s.addListItem);
  const updateListItem = useResumeStore((s) => s.updateListItem);
  const removeListItem = useResumeStore((s) => s.removeListItem);

  return (
    <SectionCard
      title="Habilidades"
      description="Técnicas, comportamentais, ferramentas ou tecnologias que você domina."
    >
      <ListFieldSection
        title="Habilidades"
        absentLabel="Prefiro não listar habilidades"
        addLabel="Adicionar habilidade"
        emptyHint="Nenhuma habilidade adicionada ainda."
        status={skills.status}
        items={skills.items}
        onToggleAbsent={(checked) =>
          setListStatus("skills", checked ? "not_available" : "not_provided")
        }
        onAdd={() =>
          addListItem("skills", { id: generateId(), name: "", category: "technical" })
        }
        renderItem={(skill) => (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextField
                label="Habilidade"
                value={skill.name}
                onChange={(e) => updateListItem("skills", skill.id, { name: e.target.value })}
              />
            </div>
            <div className="w-44">
              <Select
                label="Categoria"
                options={CATEGORY_OPTIONS}
                value={skill.category}
                onChange={(e) =>
                  updateListItem("skills", skill.id, {
                    category: e.target.value as SkillCategory,
                  })
                }
              />
            </div>
            <IconButton
              icon={Trash2}
              label="Remover habilidade"
              variant="danger"
              onClick={() => removeListItem("skills", skill.id)}
            />
          </div>
        )}
      />
    </SectionCard>
  );
}
