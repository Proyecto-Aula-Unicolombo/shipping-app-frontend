import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserSchema, UpdateUserSchema } from "../schemas/createUser.schema";
import type { UserDetail, UserListItem, UsersListAPIResponse } from "@/types/users";
import { UserListParams, usersRepository } from "../repository/usersRepository";

const USERS_QUERY_KEY = ["users"] as const;
const USER_DETAIL_QUERY_KEY = (id: number) => ["users", id] as const;

interface UseUserQueryStoreOptions {
    listParams?: UserListParams;
    userId?: number | null;
}

interface UpdateUserPayload {
    id: number;
    data: UpdateUserSchema;
}

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

const fetchUserById = async (id: number): Promise<UserDetail> => {
    const res = await usersRepository.get(String(id));
    return res as UserDetail;
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

const updateUserAPI = async (pyl: UpdateUserPayload): Promise<UserListItem> => {
    const payload: any = {
        name: pyl.data.name,
        last_name: pyl.data.lastName,
        email: pyl.data.email,
        role: pyl.data.role,
        phone_number: pyl.data.phoneNumber || "",
        num_licence: pyl.data.license || "",
    };

    if (pyl.data.password && pyl.data.password.trim() !== "") {
        payload.password = pyl.data.password;
    }

    const resp = await usersRepository.update(String(pyl.id), payload);

    return (resp as unknown) as UserListItem;
};

export function useUserQueryStore(options?: UseUserQueryStoreOptions) {
    const { listParams, userId } = options || {};
    const queryClient = useQueryClient();

    // Query for fetching users list
    const usersQuery = useQuery({
        queryKey: [USERS_QUERY_KEY, listParams],
        queryFn: () => fetchUsers(listParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData
    });

    const userDetailQuery = useQuery({
        queryKey: USER_DETAIL_QUERY_KEY(userId!),
        queryFn: () => fetchUserById(userId!),
        enabled: userId !== null && userId !== undefined && userId > 0,
        staleTime: 5 * 60 * 1000,
    });

    // Mutation for creating a new user
    const createUserMutation = useMutation({
        mutationFn: createUserAPI,
        onSuccess: () => {
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
        mutationFn: updateUserAPI,
        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [USERS_QUERY_KEY],
            });

            queryClient.invalidateQueries({
                queryKey: USER_DETAIL_QUERY_KEY(variables.id),
            });
        },
        onError: (error) => {
            console.error("Error updating user status:", error);
            throw error;
        },
    });

    return {
        // List query data
        users: usersQuery.data?.items || [],
        totalItems: usersQuery.data?.total_items || 0,
        totalPages: usersQuery.data?.total_pages || 1,
        currentPage: usersQuery.data?.page || 1,
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        error: usersQuery.error,

        // Detail query data
        userDetail: userDetailQuery.data,
        isLoadingDetail: userDetailQuery.isLoading,
        isErrorDetail: userDetailQuery.isError,
        errorDetail: userDetailQuery.error,


        // Mutation data
        createUser: createUserMutation.mutate,
        createUserAsync: createUserMutation.mutateAsync,
        isCreating: createUserMutation.isPending,
        createError: createUserMutation.error,

        // Status update mutation data
        updateUser: updateUserStatusMutation.mutate,
        updateUserAsync: updateUserStatusMutation.mutateAsync,
        isUpdating: updateUserStatusMutation.isPending,
        updateError: updateUserStatusMutation.error,

        // Utility functions
        refetch: usersQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
    };
}
