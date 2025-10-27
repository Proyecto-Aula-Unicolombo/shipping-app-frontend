import { create } from "zustand";
import type { CreateUserSchema } from "../schemas/createUser.schema";
import type { UserListItem } from "@/mocks/users";
import { usersMock, addUserToMock, updateUserInMock } from "@/mocks/users";

interface UserState {
    // Data state
    users: UserListItem[];

    // Form state
    isSubmitting: boolean;
    submitError: string | null;

    // Actions
    setUsers: (users: UserListItem[]) => void;
    addUser: (user: UserListItem) => void;
    updateUser: (id: number, updates: Partial<UserListItem>) => void;
    updateUserStatus: (id: number, status: "Activo" | "Inactivo" | "Suspendido") => Promise<{ id: number; status: "Activo" | "Inactivo" | "Suspendido" }>;
    createUser: (data: CreateUserSchema) => Promise<UserListItem>;
    clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: usersMock,
    isSubmitting: false,
    submitError: null,

    setUsers: (users: UserListItem[]) => set({ users }),

    addUser: (user: UserListItem) => {
        addUserToMock(user);
        set((state) => ({
            users: [...state.users, user]
        }));
    },

    updateUser: (id: number, updates: Partial<UserListItem>) => {
        updateUserInMock(id, updates);
        set((state) => ({
            users: state.users.map(user => 
                user.id === id ? { ...user, ...updates } : user
            )
        }));
    },
    
    updateUserStatus: async (id: number, status: "Activo" | "Inactivo" | "Suspendido") => {
        set({ isSubmitting: true, submitError: null });
        
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));
            
            // Update user status in store
            get().updateUser(id, { status });
            
            console.log(`User ${id} status updated to: ${status}`);
            
            set({ isSubmitting: false });
            return { id, status }; // Return updated data
        } catch (error) {
            set({ 
                isSubmitting: false, 
                submitError: error instanceof Error ? error.message : "Error al actualizar el estado del usuario" 
            });
            throw error;
        }
    },
    
    createUser: async (data: CreateUserSchema) => {
        set({ isSubmitting: true, submitError: null });

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Generate new ID
            const newId = Math.max(...get().users.map(u => u.id)) + 1;

            // Create new user from form data
            const newUser: UserListItem = {
                id: newId,
                Name: data.name,
                LastName: data.lastName,
                Email: data.email,
                Password: "hashed-password", // In real app, this would be hashed
                Role: data.role,
                status: "Activo",
                createdAt: new Date().toISOString(),
                lastLogin: undefined, // New user hasn't logged in yet
            };

            // Add to store
            get().addUser(newUser);

            // If user is a conductor, also add to drivers mock (for integration)
            if (data.role === "conductor" && data.phoneNumber && data.license) {
                // This would typically be handled by the backend
                console.log("User created as conductor, would also create driver record");
            }

            console.log("User created:", newUser);

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

    clearError: () => set({ submitError: null }),
}));
