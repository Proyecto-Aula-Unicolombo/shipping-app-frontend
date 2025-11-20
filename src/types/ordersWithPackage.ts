
export type Status = "pendiente" | "en camino" | "entregado" | "asignada";
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
    AddressPackage: AddressPackage;
    ComercialInformation: CommercialInformation;
    Sender: Sender;
    Receiver: Receiver;
}

export interface PackagesListAPIResponse {
    items: PackageItem[];
    total_pages: number;
    total_items: number;
    page: number;
    limit: number;
}

export type PackageDetail = PackageItem;
