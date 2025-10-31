import type { ReactNode } from "react";
import { UniversalSidebar, type NavigationItem } from "@/modules/shared/components/UniversalSidebar";

type NavigationGroups = {
    primary: NavigationItem[];
    secondary?: NavigationItem;
};

interface UniversalLayoutProps {
    children: ReactNode;
    navigation: NavigationGroups;
    title: string;
    logo: ReactNode;
    userInfo: {
        name: string;
        role: string;
        avatar?: ReactNode;
    };
    onLogout?: () => void;
    profileUrl?: string;
    contentClassName?: string;
}

export function UniversalLayout({
    children,
    navigation,
    title,
    logo,
    userInfo,
    onLogout,
    profileUrl,
    contentClassName = "flex-1 px-10 py-12"
}: UniversalLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <UniversalSidebar
                navigation={navigation}
                title={title}
                logo={logo}
                userInfo={userInfo}
                onLogout={onLogout}
                profileUrl={profileUrl}
            />

            <div className="lg:pl-[260px]">
                <main className={contentClassName}>
                    <div className="mx-auto max-w-5xl lg:max-w-none">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
