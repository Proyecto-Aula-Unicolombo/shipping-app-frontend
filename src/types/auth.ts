export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    id: number;
    name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'coord' | 'driver';
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}