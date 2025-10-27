import type { ReactNode } from "react";
import { ROUTES } from "@/modules/shared/constants/routes";
import { GoHome } from 'react-icons/go';
import { BsBoxSeam } from 'react-icons/bs';
import { PiUsers } from 'react-icons/pi';
import { PiTruck } from 'react-icons/pi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { RiSettings4Line } from 'react-icons/ri';

export type NavigationItem = {
    label: string;
    href: string;
    icon: ReactNode;
};

type NavigationGroups = {
    primary: NavigationItem[];
    secondary: NavigationItem;
};

export const dashboardNavigation: NavigationGroups = {
    primary: [
        { label: "Panel", href: ROUTES.dashboard.panel, icon: <GoHome size={24} /> },
        { label: "Órdenes", href: ROUTES.dashboard.orders, icon: <BsBoxSeam size={24} /> },
        { label: "Conductores", href: ROUTES.dashboard.drivers, icon: <PiUsers size={24} /> },
        { label: "Vehículos", href: ROUTES.dashboard.vehicles, icon: <PiTruck size={24} /> },
        { label: "Incidencias", href: ROUTES.dashboard.incidents, icon: <RiErrorWarningLine size={24} /> },
    ],
    secondary: { label: "Configuración", href: ROUTES.dashboard.settings, icon: <RiSettings4Line size={24} /> },
};
