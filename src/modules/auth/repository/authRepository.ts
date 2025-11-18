import axios from 'axios';
import type { LoginRequest, LoginResponse } from '@/types/auth';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authRepository = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const res = await api.post('/auth/login', credentials);
        return res.data;
    },

    // refreshToken: async (): Promise<LoginResponse> => {
    //     const res = await api.post('/auth/refresh');
    //     return res.data;
    // },

};