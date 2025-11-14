import { create } from "zustand";
import type { CreateUserSchema } from "../schemas/createUser.schema";
import type { UserListItem } from "@/types/users";
import { usersRepository } from "../repository/usersRepository";

interface UserState {
    isSubmitting: boolean;
    submitError: string | null;

    createUser: (data: CreateUserSchema) => Promise<UserListItem>;
    updateUserStatus: (id: number, status: "Activo" | "Inactivo" | "Suspendido") => Promise<{ id: number; status: "Activo" | "Inactivo" | "Suspendido" }>;
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

    updateUserStatus: async (id: number, status: "Activo" | "Inactivo" | "Suspendido") => {
        set({ isSubmitting: true, submitError: null });
        try {
            await usersRepository.update(String(id), { status } as any);

        
            set({ isSubmitting: false });
            return { id, status };
        } catch (error) {
            set({
                isSubmitting: false,
                submitError: error instanceof Error ? error.message : "Error al actualizar el estado del usuario"
            });
            throw error;
        }
    },

    clearError: () => set({ submitError: null }),
}));