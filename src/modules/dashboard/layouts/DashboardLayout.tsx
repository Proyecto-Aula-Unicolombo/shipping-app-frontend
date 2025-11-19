import type { ReactNode } from "react";
import { dashboardNavigation } from "@/modules/dashboard/constants/navigation";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayoutClient navigation={dashboardNavigation}>
            {children}
        </DashboardLayoutClient>
    );
}