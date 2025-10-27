import type { Orders, Package } from "@/types";

export type OrderListItem = Orders & {
    SLA: string;
    ETA: string;
    ServiceType: "Standard Delivery" | "Express Delivery";
    DeliveryAddress: string;
    ClientName: string;
    ContactPhone: string;
    Notes?: string;
};

export type OrderDetail = OrderListItem & {
    Packages: Package[];
};

// Mock data for orders based on the mockup images
export const ordersMock: OrderListItem[] = [
    {
        id: 345,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "En camino",
        SLA: "2024-03-15 18:00",
        ETA: "2024-03-16 16:30",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "Main Street 123, Anytown",
        ClientName: "Central Distribution",
        ContactPhone: "+57 300 123 4567",
        Notes: "Deliver at reception",
        DriverID: 1,
        VehicleID: 201
    },
    {
        id: 346,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Entregado",
        SLA: "2024-03-15 17:00",
        ETA: "2024-03-16 16:45",
        ServiceType: "Express Delivery",
        DeliveryAddress: "Second Avenue 456, Anytown",
        ClientName: "Local Store",
        ContactPhone: "+57 301 987 6543",
        Notes: "Leave at the door",
        DriverID: 2,
        VehicleID: 202
    },
    {
        id: 2347,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 12:00",
        ETA: "2024-03-16 11:30",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "Third Lane 789, Anytown",
        ClientName: "Online Retailer",
        ContactPhone: "+57 302 556 7788",
        Notes: "Call before delivery",
        DriverID: 3,
        VehicleID: 203
    },
    {
        id: 348,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "En camino",
        SLA: "2024-03-15 15:00",
        ETA: "2024-03-16 14:45",
        ServiceType: "Express Delivery",
        DeliveryAddress: "Fourth Road 321, Anytown",
        ClientName: "Tech Company",
        ContactPhone: "+57 303 667 8899",
        Notes: "Deliver to the office",
        DriverID: 4,
        VehicleID: 204
    },
    {
        id: 349,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Entregado",
        SLA: "2024-03-15 18:00",
        ETA: "2024-03-16 18:50",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "Fifth Street 222, Anytown",
        ClientName: "Fashion Boutique",
        ContactPhone: "+57 304 778 9900",
        Notes: "Deliver to the back entrance",
        DriverID: 5,
        VehicleID: 205
    },
    {
        id: 2350,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "En camino",
        SLA: "2024-03-15 10:00",
        ETA: "2024-03-16 08:45",
        ServiceType: "Express Delivery",
        DeliveryAddress: "Sixth Avenue 333, Anytown",
        ClientName: "Grocery Store",
        ContactPhone: "+57 305 889 0011",
        Notes: "Deliver to the loading dock",
        DriverID: 6,
        VehicleID: 206
    },
    {
        id: 2351,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 14:00",
        ETA: "2024-03-16 13:30",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "Seventh Lane 444, Anytown",
        ClientName: "Pharmacy",
        ContactPhone: "+57 306 990 1122",
        Notes: "Deliver to the front desk",
        DriverID: 7,
        VehicleID: 207
    },
    {
        id: 2352,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Entregado",
        SLA: "2024-03-15 11:00",
        ETA: "2024-03-16 10:55",
        ServiceType: "Express Delivery",
        DeliveryAddress: "Eighth Road 555, Anytown",
        ClientName: "Bookstore",
        ContactPhone: "+57 307 101 2233",
        Notes: "Deliver to the customer service",
        DriverID: 1,
        VehicleID: 201
    },
    {
        id: 612,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 07:00",
        ETA: "2024-03-16 15:45",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "Ninth Street 666, Anytown",
        ClientName: "Electronics Store",
        ContactPhone: "+57 308 212 3344",
        Notes: "Deliver to the tech support",
        DriverID: 2,
        VehicleID: 202
    },
    {
        id: 354,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "En camino",
        SLA: "2024-03-15 17:00",
        ETA: "2024-03-16 18:50",
        ServiceType: "Express Delivery",
        DeliveryAddress: "Tenth Avenue 777, Anytown",
        ClientName: "Sports Shop",
        ContactPhone: "+57 309 323 4455",
        Notes: "Deliver to the manager",
        DriverID: 3,
        VehicleID: 203
    }
];

// Unassigned orders mock for the third mockup
export const unassignedOrdersMock: Omit<OrderListItem, 'DriverID' | 'VehicleID'>[] = [
    {
        id: 1001,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 18:00",
        ETA: "2024-03-16 16:30",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "123 Maple Street, Anytown",
        ClientName: "Emma Taylor",
        ContactPhone: "+57 300 123 4567",
        Notes: "Deliver at reception"
    },
    {
        id: 1002,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 17:00",
        ETA: "2024-03-16 16:45",
        ServiceType: "Express Delivery",
        DeliveryAddress: "456 Oak Avenue, Anytown",
        ClientName: "Noah Walker",
        ContactPhone: "+57 301 987 6543",
        Notes: "Leave at the door"
    },
    {
        id: 1003,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 12:00",
        ETA: "2024-03-16 11:30",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "789 Pine Lane, Anytown",
        ClientName: "Isabella Hayes",
        ContactPhone: "+57 302 556 7788",
        Notes: "Call before delivery"
    },
    {
        id: 1004,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 15:00",
        ETA: "2024-03-16 14:45",
        ServiceType: "Express Delivery",
        DeliveryAddress: "101 Elm Road, Anytown",
        ClientName: "Lucas Reed",
        ContactPhone: "+57 303 667 8899",
        Notes: "Deliver to the office"
    },
    {
        id: 1005,
        Create_at: "2024-03-15",
        Assing_at: "2024-03-16",
        Status: "Pendiente",
        SLA: "2024-03-15 18:00",
        ETA: "2024-03-16 18:50",
        ServiceType: "Standard Delivery",
        DeliveryAddress: "222 Cedar Court, Anytown",
        ClientName: "Mia Bennett",
        ContactPhone: "+57 304 778 9900",
        Notes: "Deliver to the back entrance"
    }
];

// Package mock data for order details
export const packagesMock: Package[] = [
    // Packages for Order 345
    {
        id: 12345,
        NumPakge: 1,
        StartStatus: "Entregado",
        DescriptionContent: "Dispositivos electrónicos - Smartphone y accesorios",
        Weight: 2.5,
        Dimention: 0.05,
        DeclaredValue: 500000,
        TypePackage: "Standard",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 1,
        StatusDeliveryID: 1,
        InformationDeliveryID: 1,
        ComertialInfoID: 1,
        SenderID: 1,
        ReceiverID: 1,
        OrderID: 345
    },
    // Packages for Order 346
    {
        id: 12346,
        NumPakge: 1,
        StartStatus: "Entregado",
        DescriptionContent: "Ropa y accesorios de moda",
        Weight: 1.2,
        Dimention: 0.03,
        DeclaredValue: 200000,
        TypePackage: "Express",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 2,
        StatusDeliveryID: 2,
        InformationDeliveryID: 2,
        ComertialInfoID: 2,
        SenderID: 2,
        ReceiverID: 2,
        OrderID: 346
    },
    {
        id: 12347,
        NumPakge: 2,
        StartStatus: "Entregado",
        DescriptionContent: "Zapatos deportivos",
        Weight: 0.8,
        Dimention: 0.02,
        DeclaredValue: 150000,
        TypePackage: "Express",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 2,
        StatusDeliveryID: 2,
        InformationDeliveryID: 2,
        ComertialInfoID: 2,
        SenderID: 2,
        ReceiverID: 2,
        OrderID: 346
    },
    // Packages for Order 2347
    {
        id: 12348,
        NumPakge: 1,
        StartStatus: "En Tránsito",
        DescriptionContent: "Libros y material educativo",
        Weight: 3.0,
        Dimention: 0.04,
        DeclaredValue: 150000,
        TypePackage: "Standard",
        IsFragile: true,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 3,
        StatusDeliveryID: 3,
        InformationDeliveryID: 3,
        ComertialInfoID: 3,
        SenderID: 3,
        ReceiverID: 3,
        OrderID: 2347
    },
    {
        id: 12349,
        NumPakge: 2,
        StartStatus: "En Tránsito",
        DescriptionContent: "Suministros de oficina",
        Weight: 1.5,
        Dimention: 0.025,
        DeclaredValue: 80000,
        TypePackage: "Standard",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 3,
        StatusDeliveryID: 3,
        InformationDeliveryID: 3,
        ComertialInfoID: 3,
        SenderID: 3,
        ReceiverID: 3,
        OrderID: 2347
    },
    // Packages for Order 348
    {
        id: 12350,
        NumPakge: 1,
        StartStatus: "En camino",
        DescriptionContent: "Equipos de cómputo - Laptop y mouse",
        Weight: 4.2,
        Dimention: 0.08,
        DeclaredValue: 1200000,
        TypePackage: "Express",
        IsFragile: true,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 4,
        StatusDeliveryID: 4,
        InformationDeliveryID: 4,
        ComertialInfoID: 4,
        SenderID: 4,
        ReceiverID: 4,
        OrderID: 348
    },
    // Packages for Order 349
    {
        id: 12351,
        NumPakge: 1,
        StartStatus: "Entregado",
        DescriptionContent: "Productos de belleza y cuidado personal",
        Weight: 0.9,
        Dimention: 0.015,
        DeclaredValue: 120000,
        TypePackage: "Standard",
        IsFragile: true,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 5,
        StatusDeliveryID: 5,
        InformationDeliveryID: 5,
        ComertialInfoID: 5,
        SenderID: 5,
        ReceiverID: 5,
        OrderID: 349
    },
    {
        id: 12352,
        NumPakge: 2,
        StartStatus: "Entregado",
        DescriptionContent: "Perfumes y fragancias",
        Weight: 0.6,
        Dimention: 0.01,
        DeclaredValue: 180000,
        TypePackage: "Standard",
        IsFragile: true,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 5,
        StatusDeliveryID: 5,
        InformationDeliveryID: 5,
        ComertialInfoID: 5,
        SenderID: 5,
        ReceiverID: 5,
        OrderID: 349
    },
    // Packages for Order 2350
    {
        id: 12353,
        NumPakge: 1,
        StartStatus: "En camino",
        DescriptionContent: "Productos alimenticios - Conservas y snacks",
        Weight: 5.5,
        Dimention: 0.12,
        DeclaredValue: 95000,
        TypePackage: "Express",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 6,
        StatusDeliveryID: 6,
        InformationDeliveryID: 6,
        ComertialInfoID: 6,
        SenderID: 6,
        ReceiverID: 6,
        OrderID: 2350
    },
    {
        id: 12354,
        NumPakge: 2,
        StartStatus: "En camino",
        DescriptionContent: "Bebidas y productos refrigerados",
        Weight: 3.8,
        Dimention: 0.09,
        DeclaredValue: 65000,
        TypePackage: "Express",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 6,
        StatusDeliveryID: 6,
        InformationDeliveryID: 6,
        ComertialInfoID: 6,
        SenderID: 6,
        ReceiverID: 6,
        OrderID: 2350
    },
    {
        id: 12355,
        NumPakge: 3,
        StartStatus: "En camino",
        DescriptionContent: "Productos de limpieza",
        Weight: 2.1,
        Dimention: 0.06,
        DeclaredValue: 45000,
        TypePackage: "Express",
        IsFragile: false,
        CreateAt: "2024-03-15",
        UpdateAt: "2024-03-16",
        AddressPackageID: 6,
        StatusDeliveryID: 6,
        InformationDeliveryID: 6,
        ComertialInfoID: 6,
        SenderID: 6,
        ReceiverID: 6,
        OrderID: 2350
    }
];

// Package-related functions (keep these in mocks as they're not moved to stores yet)
export function getPackagesByOrderId(orderId: number): Package[] {
    return packagesMock.filter((pkg) => pkg.OrderID === orderId);
}

export function getPackageById(id: number): Package | undefined {
    return packagesMock.find((pkg) => pkg.id === id);
}

// Legacy functions - these are now handled by the stores
// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function getOrderById(id: number): OrderListItem | undefined {
    return ordersMock.find((order) => order.id === id);
}

// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function getUnassignedOrders(): Omit<OrderListItem, 'DriverID' | 'VehicleID'>[] {
    return unassignedOrdersMock;
}

// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function getOrdersByStatus(status: string): OrderListItem[] {
    return ordersMock.filter((order) => order.Status.toLowerCase() === status.toLowerCase());
}

// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function getOrdersByServiceType(serviceType: "Standard Delivery" | "Express Delivery"): OrderListItem[] {
    return ordersMock.filter((order) => order.ServiceType === serviceType);
}

// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function assignDriverToOrder(orderId: number, driverId: number): OrderListItem | null {
    const orderIndex = ordersMock.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    ordersMock[orderIndex] = { ...ordersMock[orderIndex], DriverID: driverId };
    return ordersMock[orderIndex];
}

// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function unassignDriverFromOrder(orderId: number): OrderListItem | null {
    const orderIndex = ordersMock.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    // Remove driver and vehicle assignment
    ordersMock[orderIndex] = { ...ordersMock[orderIndex], DriverID: undefined, VehicleID: undefined };
    return ordersMock[orderIndex];
}

// @deprecated Use useOrdersStore or useOrderQueryStore instead
export function getOrdersByDriverId(driverId: number): OrderListItem[] {
    return ordersMock.filter(order => order.DriverID === driverId);
}
