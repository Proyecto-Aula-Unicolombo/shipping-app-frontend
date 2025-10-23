import type { ReactNode } from "react";
import { cn } from "@/modules/shared/utils/cn";

type AuthLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <section
      className={cn(
        "flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12",
        className
      )}
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-100">
        {children}
      </div>
    </section>
  );
}
