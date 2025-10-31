import type { ReactNode } from "react";
import { UniversalLayout } from "@/modules/shared/layouts/UniversalLayout";
import { dashboardNavigation } from "@/modules/dashboard/constants/navigation";

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <UniversalLayout
            navigation={dashboardNavigation}
            title="Logística Express"
            logo={
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                    LE
                </div>
            }
            userInfo={{
                name: "Administrador",
                role: "Admin"
            }}
            contentClassName="flex-1 px-10 py-12"
        >
            {children}
        </UniversalLayout>
    );
}
