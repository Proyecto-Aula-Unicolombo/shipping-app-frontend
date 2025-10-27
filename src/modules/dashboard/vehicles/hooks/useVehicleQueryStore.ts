import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVehicleStore } from "../stores/vehicleStore";
import type { CreateVehicleSchema } from "../schemas/createVehicle.schema";
import type { VehicleListItem } from "@/mocks/vehicles";

const VEHICLES_QUERY_KEY = ["vehicles"] as const;

// Simulate API functions
const fetchVehicles = async (): Promise<VehicleListItem[]> => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return useVehicleStore.getState().vehicles;
};

const createVehicleAPI = async (data: CreateVehicleSchema): Promise<VehicleListItem> => {
    // Use the store's createVehicle method which handles the logic
    return useVehicleStore.getState().createVehicle(data);
};


export function useVehicleQueryStore() {
    const queryClient = useQueryClient();
    const { vehicles, setVehicles } = useVehicleStore();

    // Query for fetching vehicles list
    const vehiclesQuery = useQuery({
        queryKey: VEHICLES_QUERY_KEY,
        queryFn: fetchVehicles,
        initialData: vehicles,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Mutation for creating a new vehicle
    const createVehicleMutation = useMutation({
        mutationFn: createVehicleAPI,
        onSuccess: (newVehicle) => {
            // Update the query cache with the new vehicle
            queryClient.setQueryData(VEHICLES_QUERY_KEY, (oldData: VehicleListItem[] | undefined) => {
                if (!oldData) return [newVehicle];
                return [...oldData, newVehicle];
            });

            // Also update the Zustand store to keep them in sync
            const currentVehicles = queryClient.getQueryData<VehicleListItem[]>(VEHICLES_QUERY_KEY) || [];
            setVehicles(currentVehicles);
        },
        onError: (error) => {
            console.error("Error creating vehicle:", error);
        },
    });

    return {
        // Query data
        vehicles: vehiclesQuery.data || [],
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
