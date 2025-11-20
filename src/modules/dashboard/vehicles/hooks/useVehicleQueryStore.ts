import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVehicleSchema } from "../schemas/createVehicle.schema";
import { VehicleListItem, VehicleListAPIResponse, VehicleDetail, VehicleLListUnassignedAPIResponse } from "@/types/vehicles";
import { vehiclesRepository, VehicleListParams } from "../repository/vehicleRepository";

const VEHICLES_QUERY_KEY = ["vehicles"] as const;
const VEHICLE_DETAIL_QUERY_KEY = (id: number) => ["vehicles", id] as const;


interface UseVehicleQueryStoreOptions {
    listParams?: VehicleListParams;
    vehicleId?: number | null;
}

interface UpdateVehiclePayload {
    id: number;
    data: CreateVehicleSchema;
}


const fetchVehicles = async (params?: VehicleListParams): Promise<VehicleListAPIResponse> => {
    const resp = await vehiclesRepository.list(params);
    return resp;
};

const fetchVehiclesUnassigned = async (): Promise<VehicleLListUnassignedAPIResponse[]> => {
    const resp = await vehiclesRepository.listUnassigned();
    return resp;
}

const fetchVehicleById = async (id: number): Promise<VehicleDetail> => {
    const res = await vehiclesRepository.get(String(id));
    return res as VehicleDetail;
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

const updateVehicleAPI = async (payload: UpdateVehiclePayload): Promise<VehicleListItem> => {
    const response = await vehiclesRepository.update(String(payload.id), payload.data);
    return response as VehicleListItem;
}

const deleteVehicleAPI = async (id: number): Promise<void> => {
    await vehiclesRepository.remove(String(id));
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

    const vehiclesUnassignedQuery = useQuery({
        queryKey: [...VEHICLES_QUERY_KEY, "unassigned"],
        queryFn: () => fetchVehiclesUnassigned(),
        staleTime: 5 * 1000, // 5 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData
    });

    const vehicleDetailQuery = useQuery({
        queryKey: VEHICLE_DETAIL_QUERY_KEY(vehicleId!),
        queryFn: () => fetchVehicleById(vehicleId!),
        enabled: vehicleId !== null && vehicleId !== undefined && vehicleId > 0,
        staleTime: 5 * 60 * 1000,
    });

    // Mutation for creating a new vehicle
    const createVehicleMutation = useMutation({
        mutationFn: createVehicleAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES_QUERY_KEY],
            });
        },
        onError: (error) => {
            console.error("Error creating vehicle:", error);
        },
    });

    const updateVehicleMutation = useMutation({
        mutationFn: updateVehicleAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES_QUERY_KEY],
            });

            queryClient.invalidateQueries({
                queryKey: VEHICLE_DETAIL_QUERY_KEY(vehicleId!),
            });
        },
        onError: (error) => {
            console.error("Error updating vehicle:", error);
        },
    });

    const deleteVehicleMutation = useMutation({
        mutationFn: deleteVehicleAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES_QUERY_KEY],
            });

            queryClient.invalidateQueries({
                queryKey: VEHICLE_DETAIL_QUERY_KEY(vehicleId!),
            });
        },
        onError: (error) => {
            console.error("Error deleting vehicle:", error);
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

        // Unassigned vehicles data
        vehiclesUnassigned: vehiclesUnassignedQuery.data || [],
        isLoadingUnassigned: vehiclesUnassignedQuery.isLoading,
        isErrorUnassigned: vehiclesUnassignedQuery.isError,
        errorUnassigned: vehiclesUnassignedQuery.error,
        
        // detail data
        vehicleDetail: vehicleDetailQuery.data,
        isDetailLoading: vehicleDetailQuery.isLoading,
        isDetailError: vehicleDetailQuery.isError,
        detailError: vehicleDetailQuery.error,

        // Mutation data
        createVehicle: createVehicleMutation.mutate,
        createVehicleAsync: createVehicleMutation.mutateAsync,
        isCreating: createVehicleMutation.isPending,
        createError: createVehicleMutation.error,

        // Update mutation data
        updateVehicle: updateVehicleMutation.mutate,
        updateVehicleAsync: updateVehicleMutation.mutateAsync,
        isUpdating: updateVehicleMutation.isPending,
        updateError: updateVehicleMutation.error,

        // Delete mutation data
        deleteVehicle: deleteVehicleMutation.mutate,
        deleteVehicleAsync: deleteVehicleMutation.mutateAsync,
        isDeleting: deleteVehicleMutation.isPending,
        deleteError: deleteVehicleMutation.error,

        // Utility functions
        refetch: vehiclesQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY }),
    };
}
