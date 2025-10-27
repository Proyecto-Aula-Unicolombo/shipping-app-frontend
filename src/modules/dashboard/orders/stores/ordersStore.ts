import { create } from "zustand";
import type { OrderListItem } from "@/mocks/orders";
import { ordersMock, unassignedOrdersMock } from "@/mocks/orders";
import type { CreateOrderSchema, PackageForSelection, SelectedPackage } from "../types/orderTypes";
import { availablePackagesMock } from "../types/orderTypes";

interface OrdersState {
    // Data state
    orders: OrderListItem[];
    unassignedOrders: Omit<OrderListItem, 'DriverID' | 'VehicleID'>[];
    availablePackages: PackageForSelection[];
    selectedPackages: SelectedPackage[];
    
    // Loading states
    isLoading: boolean;
    isAssigning: boolean;
    isCreating: boolean;
    error: string | null;
    
    // Actions
    setOrders: (orders: OrderListItem[]) => void;
    setUnassignedOrders: (orders: Omit<OrderListItem, 'DriverID' | 'VehicleID'>[]) => void;
    addOrder: (order: OrderListItem) => void;
    updateOrder: (id: number, updates: Partial<OrderListItem>) => void;
    
    // Package selection actions
    setAvailablePackages: (packages: PackageForSelection[]) => void;
    togglePackageSelection: (packageId: string) => void;
    addSelectedPackage: (pkg: SelectedPackage) => void;
    removeSelectedPackage: (packageId: string) => void;
    clearSelectedPackages: () => void;
    
    // Assignment actions
    assignDriverToOrder: (orderId: number, driverId: number) => Promise<OrderListItem>;
    unassignDriverFromOrder: (orderId: number) => Promise<OrderListItem>;
    
    // Order creation actions
    createOrder: (data: CreateOrderSchema) => Promise<OrderListItem>;
    
    // Query actions
    getOrderById: (id: number) => OrderListItem | undefined;
    getOrdersByDriverId: (driverId: number) => OrderListItem[];
    getOrdersByStatus: (status: string) => OrderListItem[];
    getOrdersByServiceType: (serviceType: "Standard Delivery" | "Express Delivery") => OrderListItem[];
    
    // Utility actions
    clearError: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
    // Initial state
    orders: ordersMock,
    unassignedOrders: unassignedOrdersMock,
    availablePackages: availablePackagesMock,
    selectedPackages: [],
    isLoading: false,
    isAssigning: false,
    isCreating: false,
    error: null,
    
    // Basic setters
    setOrders: (orders: OrderListItem[]) => set({ orders }),
    setUnassignedOrders: (unassignedOrders: Omit<OrderListItem, 'DriverID' | 'VehicleID'>[]) => set({ unassignedOrders }),
    
    addOrder: (order: OrderListItem) => set((state) => ({
        orders: [...state.orders, order]
    })),
    
    updateOrder: (id: number, updates: Partial<OrderListItem>) => set((state) => ({
        orders: state.orders.map(order => 
            order.id === id ? { ...order, ...updates } : order
        )
    })),
    
    // Package selection actions
    setAvailablePackages: (packages: PackageForSelection[]) => set({ availablePackages: packages }),
    
    togglePackageSelection: (packageId: string) => set((state) => {
        const pkg = state.availablePackages.find(p => p.id === packageId);
        if (!pkg) return state;
        
        const isSelected = state.selectedPackages.some(p => p.packageId === packageId);
        
        if (isSelected) {
            return {
                selectedPackages: state.selectedPackages.filter(p => p.packageId !== packageId)
            };
        } else {
            return {
                selectedPackages: [...state.selectedPackages, {
                    packageId: pkg.id,
                    clientName: pkg.clientName,
                    deliveryAddress: pkg.deliveryAddress,
                    status: pkg.status
                }]
            };
        }
    }),
    
    addSelectedPackage: (pkg: SelectedPackage) => set((state) => ({
        selectedPackages: [...state.selectedPackages, pkg]
    })),
    
    removeSelectedPackage: (packageId: string) => set((state) => ({
        selectedPackages: state.selectedPackages.filter(p => p.packageId !== packageId)
    })),
    
    clearSelectedPackages: () => set({ selectedPackages: [] }),
    
    // Assignment actions
    assignDriverToOrder: async (orderId: number, driverId: number) => {
        set({ isAssigning: true, error: null });
        
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));
            
            const orderIndex = get().orders.findIndex(order => order.id === orderId);
            if (orderIndex === -1) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            
            const updatedOrder = { ...get().orders[orderIndex], DriverID: driverId };
            get().updateOrder(orderId, { DriverID: driverId });
            
            console.log(`Driver ${driverId} assigned to order ${orderId}`);
            
            set({ isAssigning: false });
            return updatedOrder;
        } catch (error) {
            set({ 
                isAssigning: false, 
                error: error instanceof Error ? error.message : "Error al asignar conductor" 
            });
            throw error;
        }
    },
    
    unassignDriverFromOrder: async (orderId: number) => {
        set({ isAssigning: true, error: null });
        
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));
            
            const orderIndex = get().orders.findIndex(order => order.id === orderId);
            if (orderIndex === -1) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            
            const updatedOrder = { ...get().orders[orderIndex], DriverID: undefined, VehicleID: undefined };
            get().updateOrder(orderId, { DriverID: undefined, VehicleID: undefined });
            
            console.log(`Driver unassigned from order ${orderId}`);
            
            set({ isAssigning: false });
            return updatedOrder;
        } catch (error) {
            set({ 
                isAssigning: false, 
                error: error instanceof Error ? error.message : "Error al desasignar conductor" 
            });
            throw error;
        }
    },
    
    // Order creation action
    createOrder: async (data: CreateOrderSchema) => {
        set({ isCreating: true, error: null });
        
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // Create new order from form data and selected packages
            const selectedPackages = get().selectedPackages;
            if (selectedPackages.length === 0) {
                throw new Error("No packages selected");
            }
            
            // Use the first selected package for main order details
            const mainPackage = selectedPackages[0];
            
            const newOrder: OrderListItem = {
                id: Math.max(...get().orders.map(o => o.id)) + 1,
                Create_at: new Date().toISOString().split('T')[0],
                Assing_at: data.deliveryDate,
                Status: "Pendiente",
                SLA: data.deliveryDate + " 18:00",
                ETA: data.deliveryDate + " 17:30",
                ServiceType: data.serviceType,
                DeliveryAddress: mainPackage.deliveryAddress,
                ClientName: mainPackage.clientName,
                ContactPhone: "+57 300 000 0000", // Default phone
                Notes: data.notes || "",
                DriverID: undefined,
                VehicleID: undefined
            };
            
            // Add the new order to the store
            get().addOrder(newOrder);
            
            // Clear selected packages after successful creation
            get().clearSelectedPackages();
            
            console.log(`Order ${newOrder.id} created successfully`);
            
            set({ isCreating: false });
            return newOrder;
        } catch (error) {
            set({ 
                isCreating: false, 
                error: error instanceof Error ? error.message : "Error al crear la orden" 
            });
            throw error;
        }
    },
    
    // Query functions
    getOrderById: (id: number) => {
        return get().orders.find(order => order.id === id);
    },
    
    getOrdersByDriverId: (driverId: number) => {
        return get().orders.filter(order => order.DriverID === driverId);
    },
    
    getOrdersByStatus: (status: string) => {
        return get().orders.filter(order => order.Status.toLowerCase() === status.toLowerCase());
    },
    
    getOrdersByServiceType: (serviceType: "Standard Delivery" | "Express Delivery") => {
        return get().orders.filter(order => order.ServiceType === serviceType);
    },
    
    // Utility
    clearError: () => set({ error: null }),
}));
