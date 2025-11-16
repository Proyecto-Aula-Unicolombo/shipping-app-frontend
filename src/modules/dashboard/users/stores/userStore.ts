import { create } from "zustand";
import type { CreateUserSchema, UpdateUserSchema } from "../schemas/createUser.schema";
import type { UserListItem } from "@/types/users";
import { usersRepository } from "../repository/usersRepository";

interface UserState {
    isSubmitting: boolean;
    submitError: string | null;

    createUser: (data: CreateUserSchema) => Promise<UserListItem>;
    updateUser: (id: number, data: UpdateUserSchema) => Promise<UserListItem>;
    clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    isSubmitting: false,
    submitError: null,

    createUser: async (data: CreateUserSchema) => {
        set({ isSubmitting: true, submitError: null });
        try {
            const payload = {
                name: data.name,
                last_name: data.lastName,
                email: data.email,
                password: data.password,
                role: data.role,
                phone_number: data.phoneNumber,
                num_licence: data.license,
            };

            const created = await usersRepository.create(payload);
            const newUser: UserListItem = created as unknown as UserListItem;

            set({ isSubmitting: false });
            return newUser;
        } catch (error) {
            set({
                isSubmitting: false,
                submitError: error instanceof Error ? error.message : "Error al crear el usuario"
            });
            throw error;
        }
    },

    updateUser: async (id: number, data: UpdateUserSchema) => {
        set({ isSubmitting: true, submitError: null });
        try {
            const payload: any = {
                name: data.name,
                last_name: data.lastName,
                email: data.email,
                role: data.role,
                phone_number: data.phoneNumber || "",
                num_licence: data.license || "",
            };

            if (data.password && data.password.trim() !== "") {
                payload.password = data.password;
            }

            const updated = await usersRepository.update(String(id), payload);
            const updatedUser: UserListItem = updated as unknown as UserListItem;

            set({ isSubmitting: false });
            return updatedUser;
        } catch (error) {
            set({
                isSubmitting: false,
                submitError: error instanceof Error ? error.message : "Error al actualizar el usuario"
            });
            throw error;
        }
    },

    clearError: () => set({ submitError: null }),
}));    