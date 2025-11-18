import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authRepository } from '../../repository/authRepository';
import type { LoginRequest } from '@/types/auth';

export function useAuthQuery() {
    const queryClient = useQueryClient();
    const { setAuth, clearAuth } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authRepository.login(credentials),
        onSuccess: (data) => {
            // Guardar token y usuario en el store
            setAuth(data.token, data.user);
        },
        onError: (error: any) => {
            console.error('Login error:', error);
            throw error;
        },
    });

    const logout = () => {
        // Limpiar auth store
        clearAuth();

        // Limpiar todas las queries del cache
        queryClient.clear();

        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    return {
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        logout,
    };
}