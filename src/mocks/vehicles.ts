import type { Vehicle } from "@/types";

export type VehicleListItem = Vehicle;

export type VehicleDetail = VehicleListItem;

// Make the array mutable so stores can modify it
const vehiclesMockData: VehicleListItem[] = [
    {
        id: 201,
        Plate: "XYZ 123",
        Brand: "Toyota",
        Model: "Hiace",
        Color: "Blanco",
        VehicleType: "Furgoneta",
        driverId: 1,
        driverName: "Carlos Ramírez",
    },
    {
        id: 202,
        Plate: "ABC 456",
        Brand: "Hyundai",
        Model: "H350",
        Color: "Gris",
        VehicleType: "Camión",
        driverId: 2,
        driverName: "Sofía García",
    },
    {
        id: 203,
        Plate: "JKL 890",
        Brand: "Ford",
        Model: "Transit",
        Color: "Azul",
        VehicleType: "Furgón",
        driverId: 3,
        driverName: "Diego Martínez",
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

// Export the mutable array
export const vehiclesMock = vehiclesMockData;

// Functions to manipulate the mock data
export function addVehicleToMock(vehicle: VehicleListItem): void {
    vehiclesMockData.push(vehicle);
}

export function updateVehicleInMock(id: number, updates: Partial<VehicleListItem>): void {
    const index = vehiclesMockData.findIndex(vehicle => vehicle.id === id);
    if (index !== -1) {
        vehiclesMockData[index] = { ...vehiclesMockData[index], ...updates };
    }
}

export function getVehicleById(id: number): VehicleListItem | undefined {
    return vehiclesMockData.find((vehicle: VehicleListItem) => vehicle.id === id);
}

export function getAvailableVehicles(): VehicleListItem[] {
    return vehiclesMockData;
}
