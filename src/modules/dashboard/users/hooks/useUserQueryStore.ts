import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/userStore";
import type { CreateUserSchema } from "../schemas/createUser.schema";
import type { UserListItem, UsersListAPIResponse } from "@/types/users";
import { UserListParams, usersRepository } from "../repository/usersRepository";

const USERS_QUERY_KEY = ["users"] as const;

const transformAPIUser = (apiUser: any): UserListItem => {
    return {
        ID: apiUser.ID,
        Name: apiUser.Name,
        LastName: apiUser.LastName,
        Email: apiUser.Email,
        Role: apiUser.Role,
        status: "Activo",
    };
};
// API-backed functions
const fetchUsers = async (params?: UserListParams): Promise<UsersListAPIResponse> => {
    const res = await usersRepository.list(params);
    const transformedItems = res.items.map(transformAPIUser);
    return {
        items: transformedItems as UsersListAPIResponse["items"],
        total_pages: res.total_pages,
        total_items: res.total_items,
        page: res.page,
        limit: res.limit,
    };
};

const createUserAPI = async (data: CreateUserSchema): Promise<UserListItem> => {
    const payload: any = {
        name: data.name,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phone_number: data.phoneNumber,
        num_licence: data.license,
    };

    const res = await usersRepository.create(payload);
    return (res as unknown) as UserListItem;
};

const updateUserStatusAPI = async (params: { id: number; status: "Activo" | "Inactivo" | "Suspendido" }): Promise<{ id: number; status: "Activo" | "Inactivo" | "Suspendido" }> => {
    await usersRepository.update(String(params.id), { status: params.status } as any);
    return { id: params.id, status: params.status };
};

export function useUserQueryStore(params?: UserListParams) {
    const queryClient = useQueryClient();

    // Query for fetching users list
    const usersQuery = useQuery({
        queryKey: [USERS_QUERY_KEY, params],
        queryFn: () => fetchUsers(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData
    });

    // Mutation for creating a new user
    const createUserMutation = useMutation({
        mutationFn: createUserAPI,
        onSuccess: (newUser) => {
            // Update the query cache with the new user
            // queryClient.setQueryData(USERS_QUERY_KEY, (oldData: UserListItem[] | undefined) => {
            //     if (!oldData) return [newUser];
            //     return [...oldData, newUser];
            // });
            queryClient.invalidateQueries({
                queryKey: [USERS_QUERY_KEY],
            });

            // Also update the Zustand store to keep them in sync
            // const currentUsers = queryClient.getQueryData<UserListItem[]>(USERS_QUERY_KEY) || [];
            // setUsers(currentUsers);
        },
        onError: (error) => {
            console.error("Error creating user:", error);
            throw error;
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
                    user.ID === updatedData.id
                        ? { ...user, status: updatedData.status }
                        : user
                );
            });
            queryClient.invalidateQueries({
                queryKey: [USERS_QUERY_KEY],
            });
            // Also update the Zustand store to keep them in sync
            // const currentUsers = queryClient.getQueryData<UserListItem[]>(USERS_QUERY_KEY) || [];
            // setUsers(currentUsers);

            // Invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
        onError: (error) => {
            console.error("Error updating user status:", error);
            throw error;
        },
    });

    return {
        // Query data
        users: usersQuery.data?.items || [],
        totalItems: usersQuery.data?.total_items || 0,
        totalPages: usersQuery.data?.total_pages || 1,
        currentPage: usersQuery.data?.page || 1,
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
