import type { ReactNode } from "react";
import { cn } from "@/modules/shared/utils/cn";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  className?: string;
};

export function FormField({ label, htmlFor, children, error, className }: FormFieldProps) {
  return (
    <label
      className={cn("flex w-full flex-col gap-2 text-sm text-slate-600", className)}
      htmlFor={htmlFor}
    >
      <span className="font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
