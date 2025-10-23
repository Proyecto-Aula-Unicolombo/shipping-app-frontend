import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/modules/shared/utils/cn";

const baseStyles =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 placeholder:text-slate-400 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

const invalidStyles =
  "border-red-500 focus:border-red-500 focus:ring-red-100";

export type InputProps = {
  isInvalid?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, isInvalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(baseStyles, isInvalid && invalidStyles, className)}
      aria-invalid={isInvalid || undefined}
      {...props}
    />
  );
});
