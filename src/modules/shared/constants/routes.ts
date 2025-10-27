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
        incidents: "/incidencias",
        settings: "/configuracion",
    },
    settings: {
        users: "/configuracion/usuarios",
    }
} as const;

type RouteRecord = typeof ROUTES;
type RouteSections = RouteRecord[keyof RouteRecord];

export type RoutePath = RouteSections[keyof RouteSections];
export type DashboardRoute = RouteRecord["dashboard"][keyof RouteRecord["dashboard"]];
export type AuthRoute = RouteRecord["auth"][keyof RouteRecord["auth"]];
