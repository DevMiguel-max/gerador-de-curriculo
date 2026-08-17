import { forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink/90 disabled:bg-ink/40",
  secondary:
    "bg-white text-ink border border-border hover:border-ink/40 disabled:opacity-40",
  ghost:
    "bg-transparent text-ink-muted hover:text-ink disabled:opacity-40",
  danger:
    "bg-transparent text-danger hover:bg-danger/10 disabled:opacity-40",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
