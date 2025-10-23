// --- Tipo Auxiliar para Ubicación ---

/**
 * Representa un punto geométrico (geom.Point)
 */
export interface GeomPoint {
    lat: number;
    lng: number;
}

// --- Entidades Principales ---

export interface User {
    id: number;
    Name: string;
    LastName: string;
    Email: string;
    Password: string;
    Role: string;
}

export interface Driver {
    id: number;
    PhoneNumber: string;
    License: string;
    UserID: number;
    User: User;
}

export interface Vehicle {
    id: number;
    Plate: string;
    Brand: string;
    Model: string;
    Color: string;
    VehicleType: string;
}

export interface Orders {
    id: number;
    Create_at: Date | string;
    Assing_at: Date | string;
    Observation?: string;
    Status: string;
    DriverID?: number;
    Driver?: Driver;
    VehicleID?: number;
    Vehicle?: Vehicle;

    // Propiedades inferidas de las relaciones
    // Una orden tiene 1 o más paquetes y 1 o más paradas
    Packages?: Package[];
    DeliveryStops?: DeliveryStop[];
}

export interface Package {
    id: number;
    NumPakge: number;
    StartStatus: string;
    DescriptionContent: string;
    Weight: number;
    Dimention: number; // El diagrama indica float64, podría ser volumen o un solo lado
    DeclaredValue: number;
    TypePackage: string;
    IsFragile: boolean;
    CreateAt?: Date | string;
    UpdateAt?: Date | string;

    // Claves foráneas y objetos de navegación
    AddressPackageID: number;
    Address?: AddressPackage;

    StatusDeliveryID: number;
    StatusD?: StatusDelivery;

    InformationDeliveryID: number;
    InformationD?: InformationDelivery;

    ComertialInfoID: number;
    ComertialInfo?: ComertialInformation;

    SenderID: number;
    Sender?: Sender;

    ReceiverID: number;
    Receiver?: Receiver;

    // La relación 1..* implica que OrderID es requerido
    OrderID: number;
    Order?: Orders;
}

// --- Entidades Relacionadas con la Entrega ---

export interface Track {
    id: number;
    TimeStamp: Date | string;
    Location?: GeomPoint;
    DriverID?: number;
    Driver?: Driver;
}

export interface DeliveryStop {
    id: number;
    StopLocation?: GeomPoint;
    TypeStop: string;
    TimeStamp: Date | string;
    Destination: string;
    DriverID?: number;
    Driver?: Driver;

    // Inferido de la relación 1..* con Orders
    OrderID: number;
    Order?: Orders;
}

// --- Entidades Relacionadas con el Paquete ---

export interface Sender {
    id: number;
    Name: string;
    Document: string;
    Address: string;
    PhoneNumber: string;
    Email: string;
}

export interface Receiver {
    id: number;
    Name: string;
    LastName: string;
    PhoneNumber: string;
    Email: string;
}

export interface AddressPackage {
    id: number;
    Origin: string;
    Destination: string;
    DeliveryInstruction?: string;
}

export interface StatusDelivery {
    id: number;
    Status: string;
    Priority: string;
    DateStimateDelivery: Date | string;
    DateRealDelivery: Date | string;
}

export interface InformationDelivery {
    id: number;
    Observation?: string;
    SignatureReceived?: string; // Podría ser una URL a una imagen
    PhotoDelivery?: string; // Podría ser una URL a una imagen
    ReasonCancelation?: string;
}

// Typo en el diagrama, probablemente "CommercialInformation"
export interface ComertialInformation {
    id: number;
    // Typo en el diagrama, probablemente "CostSending"
    CostSennding: number;
    IsPaid: boolean;
}