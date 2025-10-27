import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesMock, type VehicleListItem } from "@/mocks/vehicles";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
const fetchVehicles = async (): Promise<VehicleListItem[]> => {
    await delay(500);
    return vehiclesMock;
};

const updateVehicleAssignment = async ({ vehicleId, driverId }: { vehicleId: number; driverId?: number }): Promise<VehicleListItem> => {
    await delay(300);
    const vehicle = vehiclesMock.find(v => v.id === vehicleId);
    if (!vehicle) {
        throw new Error("Vehicle not found");
    }
    
    // Update the mock data
    vehicle.driverId = driverId;
    vehicle.driverName = driverId ? `Driver ${driverId}` : undefined;
    
    return vehicle;
};

const createVehicle = async (vehicleData: Omit<VehicleListItem, 'id'>): Promise<VehicleListItem> => {
    await delay(500);
    const newVehicle: VehicleListItem = {
        ...vehicleData,
        id: Math.max(...vehiclesMock.map(v => v.id)) + 1,
    };
    vehiclesMock.push(newVehicle);
    return newVehicle;
};

const deleteVehicle = async (vehicleId: number): Promise<void> => {
    await delay(300);
    const index = vehiclesMock.findIndex(v => v.id === vehicleId);
    if (index === -1) {
        throw new Error("Vehicle not found");
    }
    vehiclesMock.splice(index, 1);
};

export function useVehicleQueryStore() {
    const queryClient = useQueryClient();

    // Query for fetching all vehicles
    const {
        data: vehicles = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["vehicles"],
        queryFn: fetchVehicles,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Mutation for updating vehicle assignment
    const {
        mutateAsync: updateVehicleAssignmentAsync,
        isPending: isUpdatingAssignment,
        error: updateAssignmentError,
    } = useMutation({
        mutationFn: updateVehicleAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });

    // Mutation for creating a new vehicle
    const {
        mutateAsync: createVehicleAsync,
        isPending: isCreatingVehicle,
        error: createVehicleError,
    } = useMutation({
        mutationFn: createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });

    // Mutation for deleting a vehicle
    const {
        mutateAsync: deleteVehicleAsync,
        isPending: isDeletingVehicle,
        error: deleteVehicleError,
    } = useMutation({
        mutationFn: deleteVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });

    // Helper functions
    const getVehicleById = (id: number) => {
        return vehicles.find(vehicle => vehicle.id === id);
    };

    const getVehiclesByDriverId = (driverId: number) => {
        return vehicles.filter(vehicle => vehicle.driverId === driverId);
    };

    const getUnassignedVehicles = () => {
        return vehicles.filter(vehicle => !vehicle.driverId);
    };

    return {
        vehicles,
        isLoading,
        isError,
        error,
        updateVehicleAssignmentAsync,
        isUpdatingAssignment,
        updateAssignmentError,
        createVehicleAsync,
        isCreatingVehicle,
        createVehicleError,
        deleteVehicleAsync,
        isDeletingVehicle,
        deleteVehicleError,
        getVehicleById,
        getVehiclesByDriverId,
        getUnassignedVehicles,
    };
}
