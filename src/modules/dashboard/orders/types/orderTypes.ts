import { z } from "zod";

// Package selection type for order creation
export type PackageForSelection = {
    id: string;
    clientName: string;
    deliveryAddress: string;
    status: "Pendiente" | "En Tránsito" | "Entregado";
    selected?: boolean;
};

// Selected package for order creation
export type SelectedPackage = {
    packageId: string;
    clientName: string;
    deliveryAddress: string;
    status: string;
};

// Order creation schema
export const createOrderSchema = z.object({
    selectedPackages: z.array(z.string()).min(1, "Debe seleccionar al menos un paquete"),
    serviceType: z.enum(["Standard Delivery", "Express Delivery"]),
    notes: z.string().optional(),
    deliveryDate: z.string().min(1, "Fecha de entrega es requerida"),
    priority: z.enum(["Alta", "Media", "Baja"]).default("Media"),
    driverId: z.number().min(1, "Debe seleccionar un conductor"),
    vehicleId: z.number().min(1, "Debe seleccionar un vehículo"),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

// Mock packages for selection (these would come from a packages API)
export const availablePackagesMock: PackageForSelection[] = [
    {
        id: "PKG-2023-001",
        clientName: "Sophia Clark",
        deliveryAddress: "123 Maple Street, Anytown",
        status: "Pendiente"
    },
    {
        id: "PKG-2023-002", 
        clientName: "Ethan Carter",
        deliveryAddress: "456 Oak Avenue, Anytown",
        status: "Pendiente"
    },
    {
        id: "PKG-2023-003",
        clientName: "Olivia Bennett", 
        deliveryAddress: "789 Pine Lane, Anytown",
        status: "Pendiente"
    },
    {
        id: "PKG-2023-004",
        clientName: "Liam Harper",
        deliveryAddress: "101 Elm Road, Anytown", 
        status: "Pendiente"
    },
    {
        id: "PKG-2023-005",
        clientName: "Ava Foster",
        deliveryAddress: "222 Cedar Court, Anytown",
        status: "Pendiente"
    }
];
