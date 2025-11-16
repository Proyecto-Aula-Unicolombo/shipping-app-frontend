import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVehicleSchema } from "../schemas/createVehicle.schema";
import { VehicleListItem, VehicleListAPIResponse } from "@/types/vehicles";
import { vehiclesRepository, VehicleListParams } from "../repository/vehicleRepository";

const VEHICLES_QUERY_KEY = ["vehicles"] as const;
// const VEHICLE_DETAIL_QUERY_KEY = (id: number) => ["vehicles", id] as const;


interface UseVehicleQueryStoreOptions {
    listParams?: VehicleListParams;
    vehicleId?: number | null;
}



const fetchVehicles = async (params?: VehicleListParams): Promise<VehicleListAPIResponse> => {
    const resp = await vehiclesRepository.list(params);
    return resp;
};

const createVehicleAPI = async (data: CreateVehicleSchema): Promise<VehicleListItem> => {
    const payload: any = {
        plate: data.plate,
        model: data.model,
        brand: data.brand,
        color: data.color,
        vehicle_type: data.vehicleType,
    };

    const resp = await vehiclesRepository.create(payload);

    return (resp as unknown) as VehicleListItem;
};


export function useVehicleQueryStore(options?: UseVehicleQueryStoreOptions) {
    const { listParams, vehicleId } = options || {};
    const queryClient = useQueryClient();
    // Query for fetching vehicles list
    const vehiclesQuery = useQuery({
        queryKey: [VEHICLES_QUERY_KEY, listParams],
        queryFn: () => fetchVehicles(listParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData

    });

    // Mutation for creating a new vehicle
    const createVehicleMutation = useMutation({
        mutationFn: createVehicleAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: VEHICLES_QUERY_KEY,
            });
        },
        onError: (error) => {
            console.error("Error creating vehicle:", error);
        },
    });

    return {
        // Query data
        vehicles: vehiclesQuery.data?.items || [],
        totalItems: vehiclesQuery.data?.total_items || 0,
        totalPages: vehiclesQuery.data?.total_pages || 1,
        currentPage: vehiclesQuery.data?.page || 1,
        isLoading: vehiclesQuery.isLoading,
        isError: vehiclesQuery.isError,
        error: vehiclesQuery.error,

        // Mutation data
        createVehicle: createVehicleMutation.mutate,
        createVehicleAsync: createVehicleMutation.mutateAsync,
        isCreating: createVehicleMutation.isPending,
        createError: createVehicleMutation.error,

        // Utility functions
        refetch: vehiclesQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
    };
}
