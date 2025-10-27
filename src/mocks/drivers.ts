import type { Driver } from "@/types";

export type DriverListItem = Driver & {
    status: "Activo" | "Inactivo";
    lastOrderNumber: string;
    Address: string;
};

export type DriverDetail = DriverListItem;

export const driversMock: DriverListItem[] = [
    {
        id: 1,
        PhoneNumber: "+57 300 123 4567",
        License: "LIC-12345",
        UserID: 101,
        User: {
            id: 101,
            Name: "Carlos",
            LastName: "Ramírez",
            Email: "carlos.ramirez@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Activo",
        lastOrderNumber: "12345",
        Address: "Calle 10 #45-23, Medellín, Colombia",
        Vehicle: {
            id: 201,
            Plate: "XYZ 123",
            Brand: "Toyota",
            Model: "Hiace",
            Color: "Blanco",
            VehicleType: "Furgoneta",
            driverId: 1,
            driverName: "Carlos Ramírez"
        },
    },
    {
        id: 2,
        PhoneNumber: "+57 300 765 4321",
        License: "LIC-67890",
        UserID: 102,
        User: {
            id: 102,
            Name: "Sofía",
            LastName: "García",
            Email: "sofia.garcia@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Inactivo",
        lastOrderNumber: "67890",
        Address: "Carrera 25 #15-30, Bogotá, Colombia",
        Vehicle: {
            id: 202,
            Plate: "ABC 456",
            Brand: "Hyundai",
            Model: "H350",
            Color: "Gris",
            VehicleType: "Camión",
            driverId: 2,
            driverName: "Sofía García"
        },
    },
    {
        id: 3,
        PhoneNumber: "+57 301 234 5678",
        License: "LIC-11223",
        UserID: 103,
        User: {
            id: 103,
            Name: "Diego",
            LastName: "Martínez",
            Email: "diego.martinez@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Activo",
        lastOrderNumber: "11223",
        Address: "Av. Las Palmas 120, Medellín, Colombia",
        Vehicle: {
            id: 203,
            Plate: "JKL 890",
            Brand: "Ford",
            Model: "Transit",
            Color: "Azul",
            VehicleType: "Furgón",
            driverId: 3,
            driverName: "Diego Martínez"
        },
    },
    {
        id: 4,
        PhoneNumber: "+57 301 987 6543",
        License: "LIC-44556",
        UserID: 104,
        User: {
            id: 104,
            Name: "Isabella",
            LastName: "López",
            Email: "isabella.lopez@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Activo",
        lastOrderNumber: "44556",
        Address: "Calle 80 #32-40, Bogotá, Colombia",
    },
    {
        id: 5,
        PhoneNumber: "+57 302 112 2334",
        License: "LIC-77889",
        UserID: 105,
        User: {
            id: 105,
            Name: "Mateo",
            LastName: "Hernández",
            Email: "mateo.hernandez@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Inactivo",
        lastOrderNumber: "77889",
        Address: "Cra. 50 #18-90, Cali, Colombia",
    },
    {
        id: 6,
        PhoneNumber: "+57 302 556 7788",
        License: "LIC-99881",
        UserID: 106,
        User: {
            id: 106,
            Name: "Valentina",
            LastName: "Rojas",
            Email: "valentina.rojas@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Activo",
        lastOrderNumber: "99881",
        Address: "Diagonal 23 #9-12, Barranquilla, Colombia",
    },
    {
        id: 7,
        PhoneNumber: "+57 303 667 8899",
        License: "LIC-33445",
        UserID: 107,
        User: {
            id: 107,
            Name: "Andrés",
            LastName: "Silva",
            Email: "andres.silva@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Inactivo",
        lastOrderNumber: "33445",
        Address: "Av. Boyacá 200, Bogotá, Colombia",
    },
    // Conductores sin vehículo asignado
    {
        id: 8,
        PhoneNumber: "+57 304 123 4567",
        License: "LIC-88990",
        UserID: 108,
        User: {
            id: 108,
            Name: "Camila",
            LastName: "Torres",
            Email: "camila.torres@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Activo",
        lastOrderNumber: "88990",
        Address: "Calle 45 #12-34, Medellín, Colombia",
    },
    {
        id: 9,
        PhoneNumber: "+57 305 987 6543",
        License: "LIC-55667",
        UserID: 109,
        User: {
            id: 109,
            Name: "Sebastián",
            LastName: "Morales",
            Email: "sebastian.morales@example.com",
            Password: "hashed-password",
            Role: "driver",
        },
        status: "Activo",
        lastOrderNumber: "55667",
        Address: "Carrera 15 #78-90, Bogotá, Colombia",
    },
];

export function getDriverById(id: number): DriverListItem | undefined {
    return driversMock.find((driver) => driver.id === id);
}

export function getAvailableDrivers(): DriverListItem[] {
    return driversMock.filter((driver) => driver.status === "Activo");
}
