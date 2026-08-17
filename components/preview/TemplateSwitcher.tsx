"use client";

import { ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useResumeStore } from "@/lib/store/resumeStore";
import { TEMPLATE_META } from "@/components/templates";
import type { TemplateId } from "@/types/resume";

const TEMPLATE_ORDER: TemplateId[] = [
  "classic",
  "modern",
  "minimal",
  "executive",
  "tech",
  "first-job",
];

export function TemplateSwitcher() {
  const templateId = useResumeStore((s) => s.resume.settings.templateId);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2">
      {TEMPLATE_ORDER.map((id) => {
        const meta = TEMPLATE_META[id];
        const selected = id === templateId;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTemplate(id)}
            aria-pressed={selected}
            className={clsx(
              "w-40 shrink-0 rounded-lg border p-3 text-left transition-colors duration-150",
              selected
                ? "border-accent bg-accent/[0.06] ring-1 ring-accent"
                : "border-border bg-white hover:border-ink/30",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink">{meta.label}</span>
              {meta.atsFriendly && (
                <span title="Amigável para ATS">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-muted">{meta.description}</p>
          </button>
        );
      })}
    </div>
  );
}
