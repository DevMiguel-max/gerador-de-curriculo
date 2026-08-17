"use client";

import { Trash2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { generateId } from "@/lib/utils/id";
import type { LanguageProficiency } from "@/types/resume";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { IconButton } from "@/components/ui/IconButton";
import { ListFieldSection } from "@/components/form/ListFieldSection";

const PROFICIENCY_OPTIONS: { value: LanguageProficiency; label: string }[] = [
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "fluent", label: "Fluente" },
  { value: "native", label: "Nativo" },
];

export function Step07Languages() {
  const languages = useResumeStore((s) => s.resume.languages);
  const setListStatus = useResumeStore((s) => s.setListStatus);
  const addListItem = useResumeStore((s) => s.addListItem);
  const updateListItem = useResumeStore((s) => s.updateListItem);
  const removeListItem = useResumeStore((s) => s.removeListItem);

  return (
    <SectionCard title="Idiomas">
      <ListFieldSection
        title="Idiomas"
        absentLabel="Não desejo listar idiomas"
        addLabel="Adicionar idioma"
        emptyHint="Nenhum idioma adicionado ainda."
        status={languages.status}
        items={languages.items}
        onToggleAbsent={(checked) =>
          setListStatus("languages", checked ? "not_available" : "not_provided")
        }
        onAdd={() =>
          addListItem("languages", { id: generateId(), language: "", proficiency: "basic" })
        }
        renderItem={(lang) => (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextField
                label="Idioma"
                value={lang.language}
                onChange={(e) =>
                  updateListItem("languages", lang.id, { language: e.target.value })
                }
                placeholder="Ex.: Inglês"
              />
            </div>
            <div className="w-44">
              <Select
                label="Nível"
                options={PROFICIENCY_OPTIONS}
                value={lang.proficiency}
                onChange={(e) =>
                  updateListItem("languages", lang.id, {
                    proficiency: e.target.value as LanguageProficiency,
                  })
                }
              />
            </div>
            <IconButton
              icon={Trash2}
              label="Remover idioma"
              variant="danger"
              onClick={() => removeListItem("languages", lang.id)}
            />
          </div>
        )}
      />
    </SectionCard>
  );
}
