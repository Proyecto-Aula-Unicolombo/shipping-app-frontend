


export interface DriverListItem {
    ID: number;
    Name: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    NumLicence: string;
    NumOrder?: number;
    IsActive: boolean;
    OrderStatus?: string;

}

export type DriverDetail = DriverListItem;


export interface DriverAPIResponse {
    ID: number;
    Name: string;
    LastName: string;
    NumOrder?: number;
    IsActive: boolean;

}

export interface DriverListAPIResponse {
    items: DriverAPIResponse[];
    total_pages: number;
    total_items: number;
    page: number;
    limit: number;
}

export interface CreateDriverDTO {
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
    num_licence: string;
}

export interface UpdateDriverDTO {
    name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone_number?: string;
    num_licence?: string;
}

export interface DriverUnassignedAPIResponse {
    ID: number;
    Name: string;
    LastName: string;
    License: string;
}