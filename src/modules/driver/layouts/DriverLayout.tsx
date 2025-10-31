import type { ReactNode } from "react";
import { UniversalLayout } from "@/modules/shared/layouts/UniversalLayout";
import { driverNavigation } from "@/modules/driver/constants/navigation";
import { ROUTES } from "@/modules/shared/constants/routes";
import { FiTruck } from "react-icons/fi";

export function DriverLayout({ children }: { children: ReactNode }) {
    return (
        <UniversalLayout
            navigation={driverNavigation}
            title="Conductor"
            logo={
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FiTruck size={18} className="text-white" />
                </div>
            }
            userInfo={{
                name: "Carlos Ramírez",
                role: "Conductor"
            }}
            profileUrl={ROUTES.driver.profile}
            contentClassName="min-h-screen pt-16 lg:pt-0"
        >
            {children}
        </UniversalLayout>
    );
}
