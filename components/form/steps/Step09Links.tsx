"use client";

import { Trash2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import type { FieldState } from "@/types/resume";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { AbsenceCheckbox } from "@/components/ui/AbsenceCheckbox";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

type LinkKey = "linkedin" | "github" | "portfolio" | "website";

const LINK_META: Record<LinkKey, { label: string; placeholder: string; absentLabel: string }> = {
  linkedin: {
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/seu-usuario",
    absentLabel: "Não possuo LinkedIn",
  },
  github: {
    label: "GitHub",
    placeholder: "https://github.com/seu-usuario",
    absentLabel: "Não possuo GitHub",
  },
  portfolio: {
    label: "Portfólio",
    placeholder: "https://seuportfolio.com",
    absentLabel: "Não possuo portfólio",
  },
  website: {
    label: "Site pessoal",
    placeholder: "https://seusite.com",
    absentLabel: "Não possuo site pessoal",
  },
};

function LinkRow({
  linkKey,
  field,
  onChange,
}: {
  linkKey: LinkKey;
  field: FieldState<string>;
  onChange: (patch: Partial<FieldState<string>>) => void;
}) {
  const meta = LINK_META[linkKey];
  const absent = field.status === "not_available";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{meta.label}</span>
        <AbsenceCheckbox
          label={meta.absentLabel}
          checked={absent}
          onChange={(checked) =>
            onChange({ status: checked ? "not_available" : "not_provided", value: null })
          }
        />
      </div>
      {!absent && (
        <TextField
          label=""
          aria-label={meta.label}
          value={field.value ?? ""}
          onChange={(e) => onChange({ status: "provided", value: e.target.value })}
          placeholder={meta.placeholder}
        />
      )}
    </div>
  );
}

export function Step09Links() {
  const personalInfo = useResumeStore((s) => s.resume.personalInfo);
  const setPersonalLinkField = useResumeStore((s) => s.setPersonalLinkField);
  const addOtherLink = useResumeStore((s) => s.addOtherLink);
  const updateOtherLink = useResumeStore((s) => s.updateOtherLink);
  const removeOtherLink = useResumeStore((s) => s.removeOtherLink);
  const setOtherLinksStatus = useResumeStore((s) => s.setOtherLinksStatus);

  const otherLinksAbsent = personalInfo.otherLinks.status === "not_available";

  return (
    <SectionCard title="Links profissionais" description="Todos opcionais.">
      <div className="flex flex-col gap-5">
        {(Object.keys(LINK_META) as LinkKey[]).map((key) => (
          <LinkRow
            key={key}
            linkKey={key}
            field={personalInfo[key]}
            onChange={(patch) => setPersonalLinkField(key, patch)}
          />
        ))}

        <div className="border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Outros links</span>
            <AbsenceCheckbox
              label="Não possuo outros links"
              checked={otherLinksAbsent}
              onChange={(checked) => setOtherLinksStatus(checked ? "not_available" : "not_provided")}
            />
          </div>
          {!otherLinksAbsent && (
            <div className="flex flex-col gap-3">
              {personalInfo.otherLinks.items.map((link, index) => (
                <div key={index} className="flex items-end gap-3">
                  <div className="flex-1">
                    <TextField
                      label="Rótulo"
                      value={link.label}
                      onChange={(e) => updateOtherLink(index, { label: e.target.value })}
                      placeholder="Ex.: Behance"
                    />
                  </div>
                  <div className="flex-[2]">
                    <TextField
                      label="URL"
                      value={link.url}
                      onChange={(e) => updateOtherLink(index, { url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <IconButton
                    icon={Trash2}
                    label="Remover link"
                    variant="danger"
                    onClick={() => removeOtherLink(index)}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                className="self-start"
                onClick={() => addOtherLink({ label: "", url: "" })}
              >
                <Plus className="h-4 w-4" />
                Adicionar link
              </Button>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
