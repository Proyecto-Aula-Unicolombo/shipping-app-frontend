"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    dashboardNavigation,
    type NavigationItem,
} from "@/modules/dashboard/constants/navigation";
import { cn } from "@/modules/shared/utils/cn";
import { ROUTES } from "@/modules/shared/constants/routes";

const iconContainerBase =
    "flex h-10 w-10 items-center justify-center rounded-xl bg-inherit text-xl";
const itemBaseStyles =
    "flex items-center gap-3 rounded-xl px-4 py-1 text-sm font-medium transition-colors";
const inactiveStyles = "text-slate-600 hover:bg-slate-200";
const activeStyles = "bg-slate-200 text-slate-600 hover:bg-slate-300";

export function DashboardSidebar() {
    const pathname = usePathname();

    const renderNavItem = ({ label, href, icon }: NavigationItem) => {
        const isActive = pathname === href;

        return (
            <Link
                key={href}
                href={href}
                className={cn(itemBaseStyles, isActive ? activeStyles : inactiveStyles)}
            >
                <span className={cn(iconContainerBase, isActive && "bg-inherit text-slate-900")}>{icon}</span>
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <aside className="flex h-screen min-h-full w-[260px] flex-col justify-between border-r border-slate-200 bg-white px-6 py-10">
            <div>
                <Link href={ROUTES.dashboard.panel}>
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                            LE
                        </div>
                        <span className="text-lg font-semibold text-slate-900">
                            Logística Express
                        </span>
                    </div>
                </Link>

                <nav className="flex flex-col gap-2">
                    {dashboardNavigation.primary.map(renderNavItem)}
                </nav>
            </div>

            <div>
                <nav>{renderNavItem(dashboardNavigation.secondary)}</nav>
            </div>
        </aside>
    );
}
