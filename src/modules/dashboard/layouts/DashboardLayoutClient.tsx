"use client";

import type { ReactNode } from "react";
import { UniversalLayout } from "@/modules/shared/layouts/UniversalLayout";
import { useAuthStore } from "@/modules/auth/login/store/authStore";
import { useAuthQuery } from "@/modules/auth/login/hooks/useAuthQuery";
import type { NavigationItem } from "@/modules/shared/components/UniversalSidebar";

type NavigationGroups = {
    primary: NavigationItem[];
    secondary?: NavigationItem;
};

interface DashboardLayoutClientProps {
    children: ReactNode;
    navigation: NavigationGroups;
}

export function DashboardLayoutClient({ children, navigation }: DashboardLayoutClientProps) {
    const { user } = useAuthStore();
    const { logout } = useAuthQuery();

    const roleLabels = {
        admin: "Administrador",
        coord: "Coordinador",
        driver: "Conductor",
    };

    return (
        <UniversalLayout
            navigation={navigation}
            title="Logística Express"
            logo={
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                    LE
                </div>
            }
            userInfo={{
                name: user ? `${user.name} ${user.last_name}` : "Usuario",
                role: user ? roleLabels[user.role] : "N/A",
            }}
            onLogout={logout}
            contentClassName="flex-1 px-10 py-12"
        >
            {children}
        </UniversalLayout>
    );
}