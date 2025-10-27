import type { User } from "@/types";

export type UserRole = "admin" | "coordinador" | "conductor" | "remitente";
export type PublicUserRole = "coordinador" | "conductor" | "remitente";

export interface UserListItem extends User {
    status: "Activo" | "Inactivo" | "Suspendido";
    createdAt: string;
    lastLogin?: string;
    avatar?: string;
}

export type UserDetail = UserListItem;

// Make the array mutable so stores can modify it
const usersMockData: UserListItem[] = [
    // Administradores
    {
        id: 1,
        Name: "Ana María",
        LastName: "González",
        Email: "admin@logistica.com",
        Password: "hashed-password",
        Role: "admin",
        status: "Activo",
        createdAt: "2023-01-15T08:00:00Z",
        lastLogin: "2024-01-20T14:30:00Z"
    },
    {
        id: 2,
        Name: "Roberto",
        LastName: "Mendoza",
        Email: "roberto.admin@logistica.com",
        Password: "hashed-password",
        Role: "admin",
        status: "Activo",
        createdAt: "2023-02-10T09:15:00Z",
        lastLogin: "2024-01-19T16:45:00Z"
    },

    // Coordinadores
    {
        id: 3,
        Name: "María Elena",
        LastName: "Rodríguez",
        Email: "coordinador1@logistica.com",
        Password: "hashed-password",
        Role: "coordinador",
        status: "Activo",
        createdAt: "2023-03-05T10:30:00Z",
        lastLogin: "2024-01-20T12:15:00Z"
    },
    {
        id: 4,
        Name: "Alejandro",
        LastName: "Vargas",
        Email: "alejandro.coord@logistica.com",
        Password: "hashed-password",
        Role: "coordinador",
        status: "Activo",
        createdAt: "2023-03-20T11:45:00Z",
        lastLogin: "2024-01-20T09:30:00Z"
    },
    {
        id: 5,
        Name: "Carmen",
        LastName: "Jiménez",
        Email: "carmen.coord@logistica.com",
        Password: "hashed-password",
        Role: "coordinador",
        status: "Inactivo",
        createdAt: "2023-04-12T14:20:00Z",
        lastLogin: "2024-01-10T17:00:00Z"
    },

    // Conductores (usando los existentes)
    {
        id: 101,
        Name: "Carlos",
        LastName: "Ramírez",
        Email: "carlos.ramirez@example.com",
        Password: "hashed-password",
        Role: "conductor",
        status: "Activo",
        createdAt: "2023-05-01T08:00:00Z",
        lastLogin: "2024-01-20T07:30:00Z"
    },
    {
        id: 102,
        Name: "Sofía",
        LastName: "García",
        Email: "sofia.garcia@example.com",
        Password: "hashed-password",
        Role: "conductor",
        status: "Activo",
        createdAt: "2023-05-15T09:30:00Z",
        lastLogin: "2024-01-20T06:45:00Z"
    },
    {
        id: 103,
        Name: "Diego",
        LastName: "Martínez",
        Email: "diego.martinez@example.com",
        Password: "hashed-password",
        Role: "conductor",
        status: "Activo",
        createdAt: "2023-06-01T10:15:00Z",
        lastLogin: "2024-01-19T18:20:00Z"
    },
    {
        id: 104,
        Name: "Luisa",
        LastName: "Hernández",
        Email: "luisa.hernandez@example.com",
        Password: "hashed-password",
        Role: "conductor",
        status: "Activo",
        createdAt: "2023-06-20T11:00:00Z",
        lastLogin: "2024-01-20T08:15:00Z"
    },
    {
        id: 105,
        Name: "Miguel",
        LastName: "Torres",
        Email: "miguel.torres@example.com",
        Password: "hashed-password",
        Role: "conductor",
        status: "Suspendido",
        createdAt: "2023-07-10T12:30:00Z",
        lastLogin: "2024-01-15T14:00:00Z"
    },

    // Remitentes
    {
        id: 201,
        Name: "Empresa ABC",
        LastName: "Logística",
        Email: "contacto@empresaabc.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Activo",
        createdAt: "2023-08-01T13:45:00Z",
        lastLogin: "2024-01-20T15:30:00Z"
    },
    {
        id: 202,
        Name: "Comercial",
        LastName: "Del Caribe",
        Email: "pedidos@comercialcaribe.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Activo",
        createdAt: "2023-08-15T14:20:00Z",
        lastLogin: "2024-01-19T11:45:00Z"
    },
    {
        id: 203,
        Name: "Distribuidora",
        LastName: "Cartagena",
        Email: "envios@distribuidoractg.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Activo",
        createdAt: "2023-09-01T15:10:00Z",
        lastLogin: "2024-01-20T10:20:00Z"
    },
    {
        id: 204,
        Name: "Farmacia",
        LastName: "Central",
        Email: "despachos@farmaciacentral.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Activo",
        createdAt: "2023-09-20T16:00:00Z",
        lastLogin: "2024-01-18T13:15:00Z"
    },
    {
        id: 205,
        Name: "Supermercado",
        LastName: "La Plaza",
        Email: "domicilios@laplaza.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Inactivo",
        createdAt: "2023-10-05T17:30:00Z",
        lastLogin: "2024-01-12T09:00:00Z"
    },
    {
        id: 206,
        Name: "Restaurante",
        LastName: "El Pescador",
        Email: "delivery@elpescador.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Activo",
        createdAt: "2023-10-20T18:15:00Z",
        lastLogin: "2024-01-20T19:30:00Z"
    },
    {
        id: 207,
        Name: "Tienda",
        LastName: "Tecnológica",
        Email: "ventas@tecnostore.com",
        Password: "hashed-password",
        Role: "remitente",
        status: "Activo",
        createdAt: "2023-11-01T19:45:00Z",
        lastLogin: "2024-01-19T16:20:00Z"
    }
];

// Export the mutable array
export const usersMock = usersMockData;

// Functions to manipulate the mock data
export function addUserToMock(user: UserListItem): void {
    usersMockData.push(user);
}

export function updateUserInMock(id: number, updates: Partial<UserListItem>): void {
    const index = usersMockData.findIndex(user => user.id === id);
    if (index !== -1) {
        usersMockData[index] = { ...usersMockData[index], ...updates };
    }
}

// Utility functions
export function getUserById(id: number): UserListItem | undefined {
    return usersMockData.find((user) => user.id === id);
}

export function getUsersByRole(role: UserRole): UserListItem[] {
    return usersMockData.filter((user) => user.Role === role);
}

export function getUsersByStatus(status: "Activo" | "Inactivo" | "Suspendido"): UserListItem[] {
    return usersMockData.filter((user) => user.status === status);
}

export function getActiveUsers(): UserListItem[] {
    return getUsersByStatus("Activo");
}

// Get users filtered by current user role (admins see all, others don't see admins)
export function getVisibleUsers(currentUserRole: UserRole): UserListItem[] {
    if (currentUserRole === "admin") {
        return usersMock; // Admins see all users including other admins
    }
    return usersMock.filter(user => user.Role !== "admin"); // Non-admins don't see admin users
}

// Get visible users count based on current user role
export function getVisibleUsersCount(currentUserRole: UserRole): { 
    total: number; 
    byRole: Record<PublicUserRole, number>; 
    byStatus: Record<string, number>;
    showAdminStats: boolean;
} {
    const visibleUsers = getVisibleUsers(currentUserRole);
    const showAdminStats = currentUserRole === "admin";
    
    const byRole = {
        coordinador: visibleUsers.filter(u => u.Role === "coordinador").length,
        conductor: visibleUsers.filter(u => u.Role === "conductor").length,
        remitente: visibleUsers.filter(u => u.Role === "remitente").length
    };

    const byStatus = {
        Activo: visibleUsers.filter(u => u.status === "Activo").length,
        Inactivo: visibleUsers.filter(u => u.status === "Inactivo").length,
        Suspendido: visibleUsers.filter(u => u.status === "Suspendido").length
    };

    return {
        total: visibleUsers.length,
        byRole,
        byStatus,
        showAdminStats
    };
}

// Legacy function for backward compatibility
export function getUsersCount(): { total: number; byRole: Record<UserRole, number>; byStatus: Record<string, number> } {
    const byRole = {
        admin: getUsersByRole("admin").length,
        coordinador: getUsersByRole("coordinador").length,
        conductor: getUsersByRole("conductor").length,
        remitente: getUsersByRole("remitente").length
    };

    const byStatus = {
        Activo: getUsersByStatus("Activo").length,
        Inactivo: getUsersByStatus("Inactivo").length,
        Suspendido: getUsersByStatus("Suspendido").length
    };

    return {
        total: usersMock.length,
        byRole,
        byStatus
    };
}
