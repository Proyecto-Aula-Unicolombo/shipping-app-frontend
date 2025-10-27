import type { Vehicle } from "@/types";

export type VehicleListItem = Vehicle;

export type VehicleDetail = VehicleListItem;

export const vehiclesMock: VehicleListItem[] = [
    {
        id: 201,
        Plate: "XYZ 123",
        Brand: "Toyota",
        Model: "Hiace",
        Color: "Blanco",
        VehicleType: "Furgoneta",
    },
    {
        id: 202,
        Plate: "ABC 456",
        Brand: "Hyundai",
        Model: "H350",
        Color: "Gris",
        VehicleType: "Camión",
    },
    {
        id: 203,
        Plate: "JKL 890",
        Brand: "Ford",
        Model: "Transit",
        Color: "Azul",
        VehicleType: "Furgón",
    },
    {
        id: 204,
        Plate: "MNO 321",
        Brand: "Mercedes-Benz",
        Model: "Sprinter",
        Color: "Negro",
        VehicleType: "Furgoneta",
    },
    {
        id: 205,
        Plate: "PQR 567",
        Brand: "Renault",
        Model: "Master",
        Color: "Rojo",
        VehicleType: "Camión",
    },
    {
        id: 206,
        Plate: "STU 901",
        Brand: "Volkswagen",
        Model: "Crafter",
        Color: "Verde",
        VehicleType: "Furgón",
    },
    {
        id: 207,
        Plate: "VWX 234",
        Brand: "Chevrolet",
        Model: "NKR",
        Color: "Amarillo",
        VehicleType: "Camión",
    },
    {
        id: 208,
        Plate: "DEF 789",
        Brand: "Nissan",
        Model: "NV200",
        Color: "Plata",
        VehicleType: "Furgoneta",
    },
    {
        id: 209,
        Plate: "GHI 012",
        Brand: "Iveco",
        Model: "Daily",
        Color: "Azul Marino",
        VehicleType: "Camión",
    },
];

export function getVehicleById(id: number): VehicleListItem | undefined {
    return vehiclesMock.find((vehicle) => vehicle.id === id);
}

export function getAvailableVehicles(): VehicleListItem[] {
    return vehiclesMock;
}
