import type { ReactNode } from "react";
import { DashboardSidebar } from "@/modules/dashboard/components/DashboardSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <DashboardSidebar />

            <main className="flex-1 px-10 py-12">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    );
}
