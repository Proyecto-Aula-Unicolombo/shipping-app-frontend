

export interface VehicleListItem {
    ID: number;
    Plate: string;
    Brand: string;
    Model: string;
    Color: string;
    VehicleType: string;
    DriverName?: string;
    DriverLastName?: string;
} 

export type VehicleDetail = VehicleListItem;

export interface VehicleListAPIResponse { 
    items: VehicleListItem[];
    total_pages: number;
    total_items: number;
    page: number;
    limit: number;
}

export interface CreateVehicleDTO {
    plate: string;
    brand: string;
    model: string;
    color: string;
    vehicle_type: string;
}
export interface UpdateVehicleDTO {
    plate?: string;
    brand?: string;
    model?: string;
    color?: string;
    vehicle_type?: string;
}


export interface VehicleLListUnassignedAPIResponse { 
    ID: number;
    Plate: string;
    Brand: string;
    Model: string;
    VehicleType: string;
}