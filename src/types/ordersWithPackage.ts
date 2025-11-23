
export type Status = "pendiente" | "en camino" | "entregado" | "asignada" | "incidente";
export type ServiceType = "standard delivery" | "express delivery";

export interface OrderListItem {
    ID: number;
    Observation: string;
    status: Status;
    TypeService: ServiceType;
}

export type OrderDetail = OrderListItem;


export interface OrderAPIResponse {
    ID: number;
    Observation: string;
    Status: Status;
    TypeService: ServiceType;
}

export interface OrdersListAPIResponse {
    items: OrderAPIResponse[];
    total_pages: number;
    total_items: number;
    page: number;
    limit: number;
}

export interface CreateOrderDTO {
    observation: string;
    driver_id: number;
    vehicle_id: number;
    package_ids: number[];
    type_service: string;
}

export interface UpdateOrderDTO {
    observation?: string;
    driver_id?: number;
    vehicle_id?: number;
    package_ids?: number[];
    type_service?: string;
}



// packages

export interface AddressPackage {
    origin: string;
    destination: string;
    delivery_instructions?: string;
}

export interface CommercialInformation {
    cost_sending: number;
    is_paid: boolean;
}

export interface Sender {
    name: string;
    email: string;
}

export interface Receiver {
    name: string;
    last_name: string;
    phone_number: string;
    email: string;
}

export interface InformationDelivery {
    ID: number;
    Observation?: string;
    SignatureReceived: string;
    PhotoDelivery: string;
    ReasonCancellation?: string;
}

export interface PackageItem {
    ID: number;
    NumPackage: string;
    Status: string;
    DescriptionContent: string;
    Weight: number;
    Dimension: string;
    DeclaredValue: number;
    TypePackage: string;
    IsFragile: boolean;
    IdOrder: number;
    CreatedAt: string;
    AddressPackage: AddressPackage;
    ComercialInformation: CommercialInformation;
    Sender: Sender | null;
    Receiver: Receiver;
    DeliveryInformation: InformationDelivery | null;
}

export interface PackageResponse {
    ID: number;
    NumPackage: string;
    Status: string;
    TypePackage: string;
    AddressPackage: AddressPackage;
    Receiver: Receiver;
}

export interface PackagesListAPIResponse {
    items: PackageResponse[];
    total_pages: number;
    total_items: number;
    page: number;
    limit: number;
}

export type PackageDetail = PackageItem;

// New Interfaces for Order Detail Response

export interface Driver {
    ID: number;
    Name: string;
    LastName: string;
    Email: string;
}

export interface Vehicle {
    ID: number;
    Plate: string;
    Brand: string;
    Model: string;
    Color: string;
    VehicleType: string;
}

export interface OrderDetailResponse {
    ID: number;
    Status: string;
    Observation: string;
    TypeService: string;
    Driver?: Driver;
    Vehicle?: Vehicle;
    CreateAt: string;
    AssignedAt: string;
    Packages: PackageItem[];
}
