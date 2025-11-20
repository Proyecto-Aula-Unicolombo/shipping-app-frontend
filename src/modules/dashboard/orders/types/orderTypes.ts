import { z } from "zod";



// Order creation schema
export const createOrderSchema = z.object({
    package_ids: z.array(z.string()).min(1, "Debe seleccionar al menos un paquete"),
    serviceType: z.enum(["standard delivery", "express delivery"]),
    notes: z.string().optional(),
    driverId: z.number().optional(),
    vehicleId: z.number().optional(),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

