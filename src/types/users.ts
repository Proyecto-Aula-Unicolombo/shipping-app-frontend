
import type { User } from "./domain";

export type UserRole = "admin" | "coord" | "driver";
export type PublicUserRole = "coordinador" | "conductor" | "administrador";

export type UserStatus = "Activo" | "Inactivo" | "Suspendido";

export interface UserListItem extends User {
    status: UserStatus;
    lastLogin?: string;
    avatar?: string;
}

export type UserDetail = UserListItem;

export interface UserAPIResponse {
    ID: number;
    Name: string;
    LastName: string;
    Email: string;
    Role: UserRole;
}

export interface UsersListAPIResponse {
    items: UserAPIResponse[];
    total_pages: number;
    total_items: number;
    page: number;
    limit: number;
}

export interface CreateUserDTO {
    name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
    phone_number?: string;
    num_licence?: string;
}

export interface UpdateUserDTO {
    name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    phone_number?: string;
    num_licence?: string;
}