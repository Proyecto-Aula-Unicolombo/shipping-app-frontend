import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDriverStore } from "../stores/driverStore";
import type { CreateDriverSchema } from "../schemas/createDriver.schema";
import type { DriverListItem } from "@/mocks/drivers";

const DRIVERS_QUERY_KEY = ["drivers"] as const;

// Simulate API functions
const fetchDrivers = async (): Promise<DriverListItem[]> => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return useDriverStore.getState().drivers;
};

const createDriverAPI = async (data: CreateDriverSchema): Promise<DriverListItem> => {
    // Use the store's createDriver method which handles the logic
    return useDriverStore.getState().createDriver(data);
};

const updateDriverStatusAPI = async (params: { id: number; status: "Activo" | "Inactivo" }): Promise<{ id: number; status: "Activo" | "Inactivo" }> => {
    return useDriverStore.getState().updateDriverStatus(params.id, params.status);
};

export function useDriverQueryStore() {
    const queryClient = useQueryClient();
    const { drivers, setDrivers } = useDriverStore();

    // Query for fetching drivers list
    const driversQuery = useQuery({
        queryKey: DRIVERS_QUERY_KEY,
        queryFn: fetchDrivers,
        initialData: drivers,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Mutation for creating a new driver
    const createDriverMutation = useMutation({
        mutationFn: createDriverAPI,
        onSuccess: (newDriver) => {
            // Update the query cache with the new driver
            queryClient.setQueryData(DRIVERS_QUERY_KEY, (oldData: DriverListItem[] | undefined) => {
                if (!oldData) return [newDriver];
                return [...oldData, newDriver];
            });

            // Also update the Zustand store to keep them in sync
            const currentDrivers = queryClient.getQueryData<DriverListItem[]>(DRIVERS_QUERY_KEY) || [];
            setDrivers(currentDrivers);
        },
        onError: (error) => {
            console.error("Error creating driver:", error);
        },
    });

    // Mutation for updating driver status
    const updateDriverStatusMutation = useMutation({
        mutationFn: updateDriverStatusAPI,
        onSuccess: (updatedData) => {
            // Update the query cache optimistically
            queryClient.setQueryData(DRIVERS_QUERY_KEY, (oldData: DriverListItem[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map(driver => 
                    driver.id === updatedData.id 
                        ? { ...driver, status: updatedData.status }
                        : driver
                );
            });
            
            // Also update the Zustand store to keep them in sync
            const currentDrivers = queryClient.getQueryData<DriverListItem[]>(DRIVERS_QUERY_KEY) || [];
            setDrivers(currentDrivers);
            
            // Invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
        },
        onError: (error) => {
            console.error("Error updating driver status:", error);
        },
    });

    return {
        // Query data
        drivers: driversQuery.data || [],
        isLoading: driversQuery.isLoading,
        isError: driversQuery.isError,
        error: driversQuery.error,

        // Mutation data
        createDriver: createDriverMutation.mutate,
        createDriverAsync: createDriverMutation.mutateAsync,
        isCreating: createDriverMutation.isPending,
        createError: createDriverMutation.error,
        
        // Status update mutation data
        updateDriverStatus: updateDriverStatusMutation.mutate,
        updateDriverStatusAsync: updateDriverStatusMutation.mutateAsync,
        isUpdatingStatus: updateDriverStatusMutation.isPending,
        updateStatusError: updateDriverStatusMutation.error,
        
        // Utility functions
        refetch: driversQuery.refetch,
        invalidate: () => queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY }),
    };
}
