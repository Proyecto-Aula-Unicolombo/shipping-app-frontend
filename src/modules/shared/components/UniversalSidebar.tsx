"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/modules/shared/utils/cn";
import { ROUTES } from "@/modules/shared/constants/routes";
import { 
    FiMenu, 
    FiX, 
    FiLogOut,
    FiUser
} from "react-icons/fi";

export type NavigationItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

type NavigationGroups = {
    primary: NavigationItem[];
    secondary?: NavigationItem;
};

interface UniversalSidebarProps {
    navigation: NavigationGroups;
    title: string;
    logo: React.ReactNode;
    userInfo: {
        name: string;
        role: string;
        avatar?: React.ReactNode;
    };
    onLogout?: () => void;
    profileUrl?: string;
    className?: string;
}

const iconContainerBase = "flex h-10 w-10 items-center justify-center rounded-xl bg-inherit text-xl";
const itemBaseStyles = "flex items-center gap-3 rounded-xl px-4 py-1 text-sm font-medium transition-colors";
const inactiveStyles = "text-slate-600 hover:bg-slate-200";
const activeStyles = "bg-slate-200 text-slate-600 hover:bg-slate-300";

export function UniversalSidebar({
    navigation,
    title,
    logo,
    userInfo,
    onLogout,
    profileUrl,
    className
}: UniversalSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            router.push(ROUTES.auth.login);
        }
    };

    const renderNavItem = ({ label, href, icon }: NavigationItem) => {
        const isActive = pathname === href;

        return (
            <Link
                key={href}
                href={href}
                className={cn(itemBaseStyles, isActive ? activeStyles : inactiveStyles)}
                onClick={() => setSidebarOpen(false)}
            >
                <span className={cn(iconContainerBase, isActive && "bg-inherit text-slate-900")}>
                    {icon}
                </span>
                <span>{label}</span>
            </Link>
        );
    };

    const renderMobileNavItem = ({ label, href, icon }: NavigationItem) => {
        const isActive = pathname === href;

        return (
            <button
                key={href}
                onClick={() => {
                    router.push(href);
                    setSidebarOpen(false);
                }}
                className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors",
                    isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                )}
            >
                {icon}
                {label}
            </button>
        );
    };

    return (
        <>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            {logo}
                            <span className="text-lg font-semibold text-slate-900">{title}</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={20} className="text-slate-600" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.primary.map(renderMobileNavItem)}
                        {navigation.secondary && (
                            <>
                                <div className="border-t border-slate-200 my-4" />
                                {renderMobileNavItem(navigation.secondary)}
                            </>
                        )}
                    </nav>

                    <div className="border-t border-slate-200 p-4">
                        <div 
                            className={`flex items-center gap-3 mb-4 ${profileUrl ? 'cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors' : ''}`}
                            onClick={() => {
                                if (profileUrl) {
                                    router.push(profileUrl);
                                    setSidebarOpen(false);
                                }
                            }}
                        >
                            {userInfo.avatar || (
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                    <FiUser size={18} className="text-slate-600" />
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-slate-900">{userInfo.name}</p>
                                <p className="text-sm text-slate-600">{userInfo.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <FiLogOut size={20} />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside className={cn(
                "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[260px] lg:flex-col lg:justify-between border-r border-slate-200 bg-white px-6 py-10",
                className
            )}>
                <div>
                    <div className="mb-10 flex items-center gap-3">
                        {logo}
                        <span className="text-lg font-semibold text-slate-900">
                            {title}
                        </span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {navigation.primary.map(renderNavItem)}
                    </nav>
                </div>

                <div>
                    {navigation.secondary && (
                        <div className="mb-6">
                            <nav>{renderNavItem(navigation.secondary)}</nav>
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-6">
                        <div 
                            className={`flex items-center gap-3 mb-4 ${profileUrl ? 'cursor-pointer hover:bg-slate-50 rounded-lg p-3 -m-3 transition-colors' : ''}`}
                            onClick={() => profileUrl && router.push(profileUrl)}
                        >
                            {userInfo.avatar || (
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                                    <FiUser size={20} className="text-slate-600" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-slate-900">{userInfo.name}</p>
                                <p className="text-sm text-slate-600">{userInfo.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <FiLogOut size={20} />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
                <button
                    type="button"
                    className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setSidebarOpen(true)}
                >
                    <FiMenu size={20} />
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-slate-900">
                    {title}
                </div>
            </div>
        </>
    );
}
