import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/modules/shared/utils/cn";

const baseStyles =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

const invalidStyles =
  "border-red-500 focus:border-red-500 focus:ring-red-100";

export type SelectProps = {
  isInvalid?: boolean;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, isInvalid, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(baseStyles, isInvalid && invalidStyles, className)}
      aria-invalid={isInvalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
});
