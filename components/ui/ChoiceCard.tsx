import clsx from "clsx";

interface ChoiceCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export function ChoiceCard({ title, description, selected, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        "flex-1 rounded-lg border px-5 py-4 text-left transition-colors duration-150",
        selected
          ? "border-accent bg-accent/[0.06] ring-1 ring-accent"
          : "border-border bg-white hover:border-ink/30",
      )}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={clsx(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-accent" : "border-border",
          )}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
        </span>
        <span className="font-medium text-ink">{title}</span>
      </span>
      {description && (
        <span className="mt-1 block pl-6 text-sm text-ink-muted">{description}</span>
      )}
    </button>
  );
}
