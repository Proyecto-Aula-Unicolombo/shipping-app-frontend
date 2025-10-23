import type { ReactNode } from "react";
import { DashboardLayout } from "@/modules/dashboard/layouts/DashboardLayout";

export default function DashboardGroupLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
