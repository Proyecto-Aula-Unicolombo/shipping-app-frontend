import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateDriverSchema } from "../schemas/createDriver.schema";
import type { DriverDetail, DriverListAPIResponse, DriverListItem, DriverUnassignedAPIResponse } from "@/types/drivers";
import { DriverListParams, driversRepository } from "../repository/driverRepository";

const DRIVERS_QUERY_KEY = ["drivers"] as const;
const DRIVERS_DETAIL_QUERY_KEY = (id: number) => ["drivers", id] as const;


interface UseDriverQueryStoreOptions {
    listParams?: DriverListParams;
    driverId?: number | null;
}

interface UpdateDriverStatus {
    id: number;
    status: boolean;
}

const fetchDrivers = async (params?: DriverListParams): Promise<DriverListAPIResponse> => {
    const res = await driversRepository.list(params);
    return res;
};

const fectchDriversUnassigned = async (): Promise<DriverUnassignedAPIResponse[]> => {
    const res = await driversRepository.listUnassigned();
    return res;
}

const fetchDriverById = async (id: number): Promise<DriverDetail> => {
    const res = await driversRepository.get(String(id));
    console.log("driver data:" + res)
    return (res as unknown) as DriverDetail;
}

const createDriverAPI = async (data: CreateDriverSchema): Promise<DriverListItem> => {
    const payload: any = {
        name: data.name,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        num_licence: data.license,
    }

    const res = await driversRepository.create(payload);
    return (res as unknown) as DriverListItem;
};

const updateDriverStatus = async (pyl: UpdateDriverStatus): Promise<DriverListItem> => {
    const res = await driversRepository.updateStatus(pyl.id, pyl.status);
    return (res as unknown) as DriverListItem;
}



export function useDriverQueryStore(options?: UseDriverQueryStoreOptions) {
    const { listParams, driverId } = options || {};
    const queryClient = useQueryClient();

    // Query for fetching drivers list
    const driversQuery = useQuery({
        queryKey: [DRIVERS_QUERY_KEY, listParams],
        queryFn: () => fetchDrivers(listParams),
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes when inactive
        placeholderData: (previousData) => previousData
    });

    const fectchDriverUnassignedQuery = useQuery({
        queryKey: [...DRIVERS_QUERY_KEY, "unassigned"],
        queryFn: () => fectchDriversUnassigned(),
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes when inactive
        placeholderData: (previousData) => previousData
    });

    const driverDetailQuery = useQuery({
        queryKey: DRIVERS_DETAIL_QUERY_KEY(driverId!),
        queryFn: () => fetchDriverById(driverId!),
        enabled: driverId !== null && driverId !== undefined && driverId > 0,
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes when inactive
    });

    // Mutation for creating a new driver
    const createDriverMutation = useMutation({
        mutationFn: createDriverAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DRIVERS_QUERY_KEY] });
        },
        onError: (error) => {
            console.error("Error creating driver:", error);
        },
    });

    const updateDriverStatusMutation = useMutation({
        mutationFn: updateDriverStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [DRIVERS_QUERY_KEY],
            });

            queryClient.invalidateQueries({
                queryKey: [DRIVERS_DETAIL_QUERY_KEY(variables.id)],

            });
        },
        onError: (error) => {
            console.error("Error updating status:", error);
            throw error;
        }
    });

    return {
        // Query data
        drivers: driversQuery.data?.items || [],
        totalItems: driversQuery.data?.total_items || 0,
        totalPages: driversQuery.data?.total_pages || 1,
        currentPage: driversQuery.data?.page || 1,
        isLoading: driversQuery.isLoading,
        isError: driversQuery.isError,
        error: driversQuery.error,

        // Unassigned drivers
        driversUnassigned: fectchDriverUnassignedQuery.data || [],
        isLoadingUnassigned: fectchDriverUnassignedQuery.isLoading,
        isErrorUnassigned: fectchDriverUnassignedQuery.isError,
        errorUnassigned: fectchDriverUnassignedQuery.error,

        // Query detail
        driverDetail: driverDetailQuery.data,
        isLoadingDetail: driverDetailQuery.isLoading,
        isErrorDetail: driverDetailQuery.isError,
        errorDetail: driverDetailQuery.error,

        // Mutation data
        createDriver: createDriverMutation.mutate,
        createDriverAsync: createDriverMutation.mutateAsync,
        isCreating: createDriverMutation.isPending,
        createError: createDriverMutation.error,

        // Mutation Update
        updateStatusDriver: updateDriverStatusMutation.mutate,
        updateStatusDriverAsync: updateDriverStatusMutation.mutateAsync,
        isUpdatingStatus: updateDriverStatusMutation.isPending,
        updateStatusError: updateDriverStatusMutation.error,

        // Utility functions
        refetch: driversQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY }),
    };
}
