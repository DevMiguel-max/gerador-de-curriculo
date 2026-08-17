import { forwardRef, useId } from "react";
import clsx from "clsx";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  maxLength?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, hint, error, optional, maxLength, id, className, value, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const length = typeof value === "string" ? value.length : 0;
    return (
      <div className="flex flex-col gap-1.5">
        {(label || maxLength) && (
          <div className="flex items-baseline justify-between">
            {label && (
              <label htmlFor={fieldId} className="text-sm font-medium text-ink">
                {label}
                {optional && (
                  <span className="ml-1.5 font-normal text-ink-muted">(opcional)</span>
                )}
              </label>
            )}
            {maxLength && (
              <span className="font-mono text-xs text-ink-muted">
                {length}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          maxLength={maxLength}
          value={value}
          aria-describedby={hint ? `${fieldId}-hint` : undefined}
          aria-invalid={Boolean(error)}
          className={clsx(
            "min-h-[7rem] resize-y rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60",
            "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
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
TextArea.displayName = "TextArea";
