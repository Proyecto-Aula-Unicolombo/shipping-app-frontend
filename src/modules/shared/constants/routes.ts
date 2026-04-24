export const ROUTES = {
    auth: {
        login: "/",
    },
    dashboard: {
        panel: "/panel",
        tracking: "/rastreo",
        orders: "/ordenes",
        createOrder: "/ordenes/crear",
        orderDetail: (id: number) => `/ordenes/${id}`,
        assignDriver: (id: number) => `/ordenes/asignar/${id}`,
        drivers: "/conductores",
        vehicles: "/vehiculos",
        createVehicle: "/vehiculos/crear",
        editVehicle: (id: number) => `/vehiculos/${id}/editar`,
        incidents: "/incidencias",
        settings: "/configuracion",
    },
    settings: {
        users: "/configuracion/usuarios",
        createUser: "/configuracion/usuarios/crear",
        editUser: (id: number) => `/configuracion/usuarios/${id}/editar`,
    },
    client: {
        tracking: "/seguimiento",
        trackPackage: (numPackage: string) => `/seguimiento/${numPackage}`,
    },
    driver: {
        orders: "/conductor/ordenes",
        orderDetail: (orderId: number) => `/conductor/ordenes/${orderId}`,
        packages: "/conductor/paquetes",
        confirmDelivery: (packageId: number) => `/conductor/paquetes/${packageId}/confirmar-entrega`,
        tracking: "/conductor/tracking",
        history: "/conductor/historial",
        profile: "/conductor/perfil",
    }
} as const;

type RouteRecord = typeof ROUTES;
type RouteSections = RouteRecord[keyof RouteRecord];

export type RoutePath = RouteSections[keyof RouteSections];
export type DashboardRoute = RouteRecord["dashboard"][keyof RouteRecord["dashboard"]];
export type AuthRoute = RouteRecord["auth"][keyof RouteRecord["auth"]];
