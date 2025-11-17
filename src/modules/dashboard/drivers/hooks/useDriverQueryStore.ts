import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateDriverSchema } from "../schemas/createDriver.schema";
import type { DriverListAPIResponse, DriverListItem } from "@/types/drivers";
import { DriverListParams, driversRepository } from "../repository/driverRepository";

const DRIVERS_QUERY_KEY = ["drivers"] as const;
const DRIVERS_DETAIL_QUERY_KEY = (id: number) => ["drivers", id] as const;


interface UseDriverQueryStoreOptions {
    listParams?: DriverListParams;
    driverId?: number | null;
}

const fetchDrivers = async (params?: DriverListParams): Promise<DriverListAPIResponse> => {
    const res = await driversRepository.list(params);
    return res;
};

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



export function useDriverQueryStore(options?: UseDriverQueryStoreOptions) {
    const { listParams, driverId } = options || {};
    const queryClient = useQueryClient();

    // Query for fetching drivers list
    const driversQuery = useQuery({
        queryKey: [DRIVERS_QUERY_KEY, listParams],
        queryFn: () => fetchDrivers(listParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData
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


    return {
        // Query data
        drivers: driversQuery.data?.items || [],
        totalItems: driversQuery.data?.total_items || 0,
        totalPages: driversQuery.data?.total_pages || 1,
        currentPage: driversQuery.data?.page || 1,
        isLoading: driversQuery.isLoading,
        isError: driversQuery.isError,
        error: driversQuery.error,

        // Mutation data
        createDriver: createDriverMutation.mutate,
        createDriverAsync: createDriverMutation.mutateAsync,
        isCreating: createDriverMutation.isPending,
        createError: createDriverMutation.error,


        // Utility functions
        refetch: driversQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY }),
    };
}
