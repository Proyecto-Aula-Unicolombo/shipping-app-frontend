import { create } from "zustand";
import type { CreateDriverSchema } from "../schemas/createDriver.schema";
import type { DriverListItem } from "@/mocks/drivers";
import { driversMock } from "@/mocks/drivers";

interface DriverState {
    // Data state
    drivers: DriverListItem[];

    // Form state
    isSubmitting: boolean;
    submitError: string | null;

    // Actions
    setDrivers: (drivers: DriverListItem[]) => void;
    addDriver: (driver: DriverListItem) => void;
    updateDriver: (id: number, updates: Partial<DriverListItem>) => void;
    updateDriverStatus: (id: number, status: "Activo" | "Inactivo") => Promise<{ id: number; status: "Activo" | "Inactivo" }>;
    createDriver: (data: CreateDriverSchema) => Promise<DriverListItem>;
    clearError: () => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
    drivers: driversMock,
    isSubmitting: false,
    submitError: null,

    setDrivers: (drivers: DriverListItem[]) => set({ drivers }),

    addDriver: (driver: DriverListItem) => set((state) => ({
        drivers: [...state.drivers, driver]
    })),

    updateDriver: (id: number, updates: Partial<DriverListItem>) => set((state) => ({
        drivers: state.drivers.map(driver => 
            driver.id === id ? { ...driver, ...updates } : driver
        )
    })),
    
    updateDriverStatus: async (id: number, status: "Activo" | "Inactivo") => {
        set({ isSubmitting: true, submitError: null });
        
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));
            
            // Update driver status in store
            get().updateDriver(id, { status });
            
            console.log(`Driver ${id} status updated to: ${status}`);
            
            set({ isSubmitting: false });
            return { id, status }; // Return updated data
        } catch (error) {
            set({ 
                isSubmitting: false, 
                submitError: error instanceof Error ? error.message : "Error al actualizar el estado del conductor" 
            });
            throw error;
        }
    },
    
    createDriver: async (data: CreateDriverSchema) => {
        set({ isSubmitting: true, submitError: null });

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create new driver from form data
            const newDriver: DriverListItem = {
                id: Math.max(...get().drivers.map(d => d.id)) + 1,
                PhoneNumber: data.phoneNumber,
                License: data.license,
                UserID: Math.floor(Math.random() * 1000) + 200,
                User: {
                    id: Math.floor(Math.random() * 1000) + 200,
                    Name: data.name,
                    LastName: data.lastName,
                    Email: data.email,
                    Password: "hashed-password",
                    Role: "driver",
                },
                status: "Activo",
                lastOrderNumber: Math.floor(Math.random() * 90000 + 10000).toString(),
                Address: data.address,
            };

            // Add to store
            get().addDriver(newDriver);

            console.log("Driver created:", newDriver);

            set({ isSubmitting: false });
            return newDriver;
        } catch (error) {
            set({
                isSubmitting: false,
                submitError: error instanceof Error ? error.message : "Error al crear el conductor"
            });
            throw error;
        }
    },

    clearError: () => set({ submitError: null }),
}));
