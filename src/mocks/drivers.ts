import type { Driver, Vehicle } from "@/types";

export type DriverListItem = Driver & {
    status: "Activo" | "Inactivo";
    lastOrderNumber: string;
    Address: string;
    Vehicle: Vehicle;
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
        Vehicle: {
            id: 204,
            Plate: "MNO 321",
            Brand: "Mercedes-Benz",
            Model: "Sprinter",
            Color: "Negro",
            VehicleType: "Furgoneta",
        },
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
        Vehicle: {
            id: 205,
            Plate: "PQR 567",
            Brand: "Renault",
            Model: "Master",
            Color: "Rojo",
            VehicleType: "Camión",
        },
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
        Vehicle: {
            id: 206,
            Plate: "STU 901",
            Brand: "Volkswagen",
            Model: "Crafter",
            Color: "Verde",
            VehicleType: "Furgón",
        },
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
        Vehicle: {
            id: 207,
            Plate: "VWX 234",
            Brand: "Chevrolet",
            Model: "NKR",
            Color: "Amarillo",
            VehicleType: "Camión",
        },
    },
];

export function getDriverById(id: number): DriverListItem | undefined {
    return driversMock.find((driver) => driver.id === id);
}
