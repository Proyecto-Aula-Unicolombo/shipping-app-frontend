import type { ReactNode } from "react";
import { DashboardLayout } from "@/modules/dashboard/layouts/DashboardLayout";
import { ProtectedRoute } from "@/modules/auth/components/ProtectRoute";

export default function DashboardGroupLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={['admin', 'coord', 'driver']}>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}
