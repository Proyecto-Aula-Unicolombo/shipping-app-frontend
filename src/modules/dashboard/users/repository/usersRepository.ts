import axios from 'axios';
import { User } from '@/types/domain';
import type { UsersListAPIResponse, CreateUserDTO, UpdateUserDTO } from '@/types/users';

export interface UserListParams {
  page: number;
  limit: number;
  name_or_last_name?: string;
  role?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const usersRepository = {
  list: async (params?: UserListParams): Promise<UsersListAPIResponse> => {
    const queryParams = new URLSearchParams({
      limit: params?.limit.toString() || "10",
      page: params?.page.toString() || "1",
    });

    if (params?.name_or_last_name && params.name_or_last_name.trim()) {
      queryParams.append("name_or_last_name", params.name_or_last_name.trim());
    }

    if (params?.role && params.role !== "all") {
      queryParams.append("role", params.role);
    }
    const res = await api.get(`/users/?${queryParams.toString()}`);
    return res.data;
  },

  get: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  create: async (payload: CreateUserDTO): Promise<User> => {
    const res = await api.post('/users', payload);
    return res.data;
  },
  update: async (id: string, payload: UpdateUserDTO): Promise<User> => {
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};