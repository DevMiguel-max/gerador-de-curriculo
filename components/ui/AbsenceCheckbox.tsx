import { useId } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

interface AbsenceCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Ex.: "Não possuo LinkedIn". Quando marcado, o campo correspondente deve
 * ser desabilitado e seu status vira "not_available" (ver seção 18-21).
 */
export function AbsenceCheckbox({ label, checked, onChange }: AbsenceCheckboxProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink-muted"
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border bg-white checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <Check
          className={clsx(
            "pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100",
          )}
          strokeWidth={3}
        />
      </span>
      {label}
    </label>
  );
}
