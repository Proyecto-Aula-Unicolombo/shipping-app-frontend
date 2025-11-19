import { useAuthStore } from '@/modules/auth/login/store/authStore';
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores 401 (token expirado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            const { clearAuth } = useAuthStore.getState();
            clearAuth();
            
            // Redirigir al login
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
        
        return Promise.reject(error);
    }
);