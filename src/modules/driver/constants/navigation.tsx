import type { ReactNode } from "react";
import { ROUTES } from "@/modules/shared/constants/routes";
import { FiTruck, FiPackage, FiClock, FiNavigation } from "react-icons/fi";

export type NavigationItem = {
    label: string;
    href: string;
    icon: ReactNode;
};

type NavigationGroups = {
    primary: NavigationItem[];
    secondary?: NavigationItem;
};

export const driverNavigation: NavigationGroups = {
    primary: [
        { label: "Tracking", href: ROUTES.driver.tracking, icon: <FiNavigation size={20} /> },
        { label: "Mis Órdenes", href: ROUTES.driver.orders, icon: <FiTruck size={20} /> },
        { label: "Paquetes", href: ROUTES.driver.packages, icon: <FiPackage size={20} /> },
        { label: "Historial", href: ROUTES.driver.history, icon: <FiClock size={20} /> },
    ],
};
