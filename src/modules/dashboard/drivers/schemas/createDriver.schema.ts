import { z } from "zod";

export const createDriverSchema = z.object({
    // Driver personal information
    name: z.string().min(1, "El nombre es requerido."),
    lastName: z.string().min(1, "El apellido es requerido."),
    phoneNumber: z.string().min(1, "El número de teléfono es requerido."),
    email: z.string().email("Ingresa un email válido."),
    address: z.string().min(1, "La dirección es requerida."),
    license: z.string().min(1, "La licencia es requerida."),
    
    // Optional vehicle assignment
    vehicleId: z.number().optional(),
});

export type CreateDriverSchema = z.infer<typeof createDriverSchema>;

export const createDriverDefaultValues: CreateDriverSchema = {
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    license: "",
    vehicleId: undefined,
};
