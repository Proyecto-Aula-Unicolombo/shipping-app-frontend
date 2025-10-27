import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/userStore";
import type { CreateUserSchema } from "../schemas/createUser.schema";
import type { UserListItem } from "@/mocks/users";

const USERS_QUERY_KEY = ["users"] as const;

// Simulate API functions
const fetchUsers = async (): Promise<UserListItem[]> => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return useUserStore.getState().users;
};

const createUserAPI = async (data: CreateUserSchema): Promise<UserListItem> => {
    // Use the store's createUser method which handles the logic
    return useUserStore.getState().createUser(data);
};

const updateUserStatusAPI = async (params: { id: number; status: "Activo" | "Inactivo" | "Suspendido" }): Promise<{ id: number; status: "Activo" | "Inactivo" | "Suspendido" }> => {
    return useUserStore.getState().updateUserStatus(params.id, params.status);
};

export function useUserQueryStore() {
    const queryClient = useQueryClient();
    const { users, setUsers } = useUserStore();

    // Query for fetching users list
    const usersQuery = useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: fetchUsers,
        initialData: users,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Mutation for creating a new user
    const createUserMutation = useMutation({
        mutationFn: createUserAPI,
        onSuccess: (newUser) => {
            // Update the query cache with the new user
            queryClient.setQueryData(USERS_QUERY_KEY, (oldData: UserListItem[] | undefined) => {
                if (!oldData) return [newUser];
                return [...oldData, newUser];
            });

            // Also update the Zustand store to keep them in sync
            const currentUsers = queryClient.getQueryData<UserListItem[]>(USERS_QUERY_KEY) || [];
            setUsers(currentUsers);
        },
        onError: (error) => {
            console.error("Error creating user:", error);
        },
    });

    // Mutation for updating user status
    const updateUserStatusMutation = useMutation({
        mutationFn: updateUserStatusAPI,
        onSuccess: (updatedData) => {
            // Update the query cache optimistically
            queryClient.setQueryData(USERS_QUERY_KEY, (oldData: UserListItem[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map(user => 
                    user.id === updatedData.id 
                        ? { ...user, status: updatedData.status }
                        : user
                );
            });
            
            // Also update the Zustand store to keep them in sync
            const currentUsers = queryClient.getQueryData<UserListItem[]>(USERS_QUERY_KEY) || [];
            setUsers(currentUsers);
            
            // Invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
        onError: (error) => {
            console.error("Error updating user status:", error);
        },
    });

    return {
        // Query data
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        error: usersQuery.error,

        // Mutation data
        createUser: createUserMutation.mutate,
        createUserAsync: createUserMutation.mutateAsync,
        isCreating: createUserMutation.isPending,
        createError: createUserMutation.error,
        
        // Status update mutation data
        updateUserStatus: updateUserStatusMutation.mutate,
        updateUserStatusAsync: updateUserStatusMutation.mutateAsync,
        isUpdatingStatus: updateUserStatusMutation.isPending,
        updateStatusError: updateUserStatusMutation.error,
        
        // Utility functions
        refetch: usersQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
    };
}
