export const ROUTES = {
    auth: {
        login: "/",
    },
    dashboard: {
        panel: "/panel",
        orders: "/ordenes",
        createOrder: "/ordenes/crear",
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
    }
} as const;

type RouteRecord = typeof ROUTES;
type RouteSections = RouteRecord[keyof RouteRecord];

export type RoutePath = RouteSections[keyof RouteSections];
export type DashboardRoute = RouteRecord["dashboard"][keyof RouteRecord["dashboard"]];
export type AuthRoute = RouteRecord["auth"][keyof RouteRecord["auth"]];
