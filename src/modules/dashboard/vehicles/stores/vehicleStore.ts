import { create } from "zustand";
import type { CreateVehicleSchema } from "../schemas/createVehicle.schema";
import type { VehicleListItem } from "@/mocks/vehicles";
import { vehiclesMock, addVehicleToMock, updateVehicleInMock } from "@/mocks/vehicles";

interface VehicleState {
    // Data state
    vehicles: VehicleListItem[];

    // Form state
    isSubmitting: boolean;
    submitError: string | null;

    // Actions
    setVehicles: (vehicles: VehicleListItem[]) => void;
    addVehicle: (vehicle: VehicleListItem) => void;
    updateVehicle: (id: number, updates: Partial<VehicleListItem>) => void;
    createVehicle: (data: CreateVehicleSchema) => Promise<VehicleListItem>;
    clearError: () => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
    vehicles: vehiclesMock,
    isSubmitting: false,
    submitError: null,

    setVehicles: (vehicles: VehicleListItem[]) => set({ vehicles }),

    addVehicle: (vehicle: VehicleListItem) => {
        addVehicleToMock(vehicle);
        set((state) => ({
            vehicles: [...state.vehicles, vehicle]
        }));
    },

    updateVehicle: (id: number, updates: Partial<VehicleListItem>) => {
        updateVehicleInMock(id, updates);
        set((state) => ({
            vehicles: state.vehicles.map(vehicle => 
                vehicle.id === id ? { ...vehicle, ...updates } : vehicle
            )
        }));
    },
    
    createVehicle: async (data: CreateVehicleSchema) => {
        set({ isSubmitting: true, submitError: null });

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Generate new ID
            const newId = Math.max(...get().vehicles.map(v => v.id)) + 1;

            // Create new vehicle from form data
            const newVehicle: VehicleListItem = {
                id: newId,
                Plate: data.plate,
                Brand: data.brand,
                Model: data.model,
                Color: data.color,
                VehicleType: data.vehicleType,
                driverId: data.driverId,
                driverName: data.driverId ? `Conductor ${data.driverId}` : undefined, // Would get from drivers mock
            };

            // Add to store
            get().addVehicle(newVehicle);

            console.log("Vehicle created:", newVehicle);

            set({ isSubmitting: false });
            return newVehicle;
        } catch (error) {
            set({
                isSubmitting: false,
                submitError: error instanceof Error ? error.message : "Error al crear el vehículo"
            });
            throw error;
        }
    },

    clearError: () => set({ submitError: null }),
}));
