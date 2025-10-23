import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/modules/shared/utils/cn";

const baseStyles =
  "cursor-pointer inline-flex items-center justify-center rounded-md border border-transparent font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-600 focus-visible:ring-offset-background",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 focus-visible:ring-slate-300",
  ghost:
    "bg-transparent text-blue-600 hover:text-blue-500 focus-visible:ring-blue-600",
} as const;

type ButtonVariant = keyof typeof variants;

type ButtonProps = {
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variants[variant], "px-4 py-2", className)}
      {...props}
    />
  );
}
