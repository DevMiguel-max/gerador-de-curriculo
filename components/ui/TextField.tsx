import { forwardRef, useId } from "react";
import clsx from "clsx";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, error, optional, id, className, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-ink">
            {label}
            {optional && (
              <span className="ml-1.5 font-normal text-ink-muted">(opcional)</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-describedby={hint ? `${fieldId}-hint` : undefined}
          aria-invalid={Boolean(error)}
          className={clsx(
            "rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60",
            "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            "disabled:bg-bg disabled:text-ink-muted",
            error && "border-danger focus:border-danger focus:ring-danger",
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-ink-muted">
            {hint}
          </p>
        )}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = "TextField";
