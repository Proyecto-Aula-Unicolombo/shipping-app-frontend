import { z } from "zod";

export const createVehicleSchema = z.object({
    // Vehicle information
    plate: z.string().min(1, "La placa es requerida."),
    brand: z.string().min(1, "La marca del vehículo es requerida."),
    model: z.string().min(1, "El modelo del vehículo es requerido."),
    color: z.string().min(1, "El color del vehículo es requerido."),
    vehicleType: z.string().min(1, "El tipo de vehículo es requerido."),
    
   
});

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>;

export const createVehicleDefaultValues: CreateVehicleSchema = {
    plate: "",
    brand: "",
    model: "",
    color: "",
    vehicleType: "",
};

export const vehicleTypes = [
    "Furgoneta",
    "Camión",
    "Furgón",
    "Motocicleta",
    "Bicicleta",
    "Otro"
] as const;
