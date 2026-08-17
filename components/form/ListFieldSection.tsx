import { Plus } from "lucide-react";
import type { FieldStatus } from "@/types/resume";
import { AbsenceCheckbox } from "@/components/ui/AbsenceCheckbox";
import { Button } from "@/components/ui/Button";

interface ListFieldSectionProps<T extends { id: string }> {
  title: string;
  description?: string;
  absentLabel: string;
  addLabel: string;
  emptyHint: string;
  status: FieldStatus;
  items: T[];
  onToggleAbsent: (checked: boolean) => void;
  onAdd: () => void;
  renderItem: (item: T) => React.ReactNode;
}

export function ListFieldSection<T extends { id: string }>({
  title,
  description,
  absentLabel,
  addLabel,
  emptyHint,
  status,
  items,
  onToggleAbsent,
  onAdd,
  renderItem,
}: ListFieldSectionProps<T>) {
  const isAbsent = status === "not_available";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-ink">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
        </div>
        <AbsenceCheckbox label={absentLabel} checked={isAbsent} onChange={onToggleAbsent} />
      </div>

      {!isAbsent && (
        <div className="flex flex-col gap-3">
          {items.length === 0 && (
            <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-ink-muted">
              {emptyHint}
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-border p-4">
              {renderItem(item)}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={onAdd} className="self-start">
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
