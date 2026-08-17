import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "danger";
}

export function IconButton({
  icon: Icon,
  label,
  variant = "default",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150",
        variant === "danger"
          ? "text-ink-muted hover:bg-danger/10 hover:text-danger"
          : "text-ink-muted hover:bg-bg hover:text-ink",
        className,
      )}
      {...props}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}
