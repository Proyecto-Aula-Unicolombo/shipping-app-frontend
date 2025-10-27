import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrdersStore } from "../stores/ordersStore";
import type { OrderListItem } from "@/mocks/orders";
import type { CreateOrderSchema } from "../types/orderTypes";

const ORDERS_QUERY_KEY = ["orders"] as const;
const UNASSIGNED_ORDERS_QUERY_KEY = ["unassigned-orders"] as const;

// Simulate API functions
const fetchOrders = async (): Promise<OrderListItem[]> => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return useOrdersStore.getState().orders;
};

const fetchUnassignedOrders = async (): Promise<Omit<OrderListItem, 'DriverID' | 'VehicleID'>[]> => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return useOrdersStore.getState().unassignedOrders;
};

const assignDriverToOrderAPI = async (params: { orderId: number; driverId: number }): Promise<OrderListItem> => {
    return useOrdersStore.getState().assignDriverToOrder(params.orderId, params.driverId);
};

const unassignDriverFromOrderAPI = async (orderId: number): Promise<OrderListItem> => {
    return useOrdersStore.getState().unassignDriverFromOrder(orderId);
};

const createOrderAPI = async (data: CreateOrderSchema): Promise<OrderListItem> => {
    return useOrdersStore.getState().createOrder(data);
};

export function useOrderQueryStore() {
    const queryClient = useQueryClient();
    const { 
        orders, 
        unassignedOrders, 
        availablePackages,
        selectedPackages,
        setOrders,
        togglePackageSelection,
        removeSelectedPackage,
        clearSelectedPackages
    } = useOrdersStore();

    // Query for fetching orders list
    const ordersQuery = useQuery({
        queryKey: ORDERS_QUERY_KEY,
        queryFn: fetchOrders,
        initialData: orders,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Query for fetching unassigned orders
    const unassignedOrdersQuery = useQuery({
        queryKey: UNASSIGNED_ORDERS_QUERY_KEY,
        queryFn: fetchUnassignedOrders,
        initialData: unassignedOrders,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Mutation for assigning driver to order
    const assignDriverMutation = useMutation({
        mutationFn: assignDriverToOrderAPI,
        onSuccess: () => {
            // Invalidate and refetch orders to get updated data
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNASSIGNED_ORDERS_QUERY_KEY });
            
            // Also update the Zustand store to keep them in sync
            const currentOrders = queryClient.getQueryData<OrderListItem[]>(ORDERS_QUERY_KEY) || [];
            setOrders(currentOrders);
        },
        onError: (error) => {
            console.error("Error assigning driver to order:", error);
        },
    });

    // Mutation for unassigning driver from order
    const unassignDriverMutation = useMutation({
        mutationFn: unassignDriverFromOrderAPI,
        onSuccess: () => {
            // Invalidate and refetch orders to get updated data
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNASSIGNED_ORDERS_QUERY_KEY });
            
            // Also update the Zustand store to keep them in sync
            const currentOrders = queryClient.getQueryData<OrderListItem[]>(ORDERS_QUERY_KEY) || [];
            setOrders(currentOrders);
        },
        onError: (error) => {
            console.error("Error unassigning driver from order:", error);
        },
    });

    // Mutation for creating order
    const createOrderMutation = useMutation({
        mutationFn: createOrderAPI,
        onSuccess: () => {
            // Invalidate and refetch orders to get updated data
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNASSIGNED_ORDERS_QUERY_KEY });
            
            // Also update the Zustand store to keep them in sync
            const currentOrders = queryClient.getQueryData<OrderListItem[]>(ORDERS_QUERY_KEY) || [];
            setOrders(currentOrders);
        },
        onError: (error) => {
            console.error("Error creating order:", error);
        },
    });

    return {
        // Query data
        orders: ordersQuery.data || [],
        unassignedOrders: unassignedOrdersQuery.data || [],
        isLoading: ordersQuery.isLoading || unassignedOrdersQuery.isLoading,
        isError: ordersQuery.isError || unassignedOrdersQuery.isError,
        error: ordersQuery.error || unassignedOrdersQuery.error,
        
        // Assignment mutations
        assignDriver: assignDriverMutation.mutate,
        assignDriverAsync: assignDriverMutation.mutateAsync,
        unassignDriver: unassignDriverMutation.mutate,
        unassignDriverAsync: unassignDriverMutation.mutateAsync,
        isAssigning: assignDriverMutation.isPending || unassignDriverMutation.isPending,
        assignError: assignDriverMutation.error || unassignDriverMutation.error,
        
        // Order creation mutations
        createOrder: createOrderMutation.mutate,
        createOrderAsync: createOrderMutation.mutateAsync,
        isCreating: createOrderMutation.isPending,
        createError: createOrderMutation.error,
        
        // Package selection state and actions
        availablePackages,
        selectedPackages,
        togglePackageSelection,
        removeSelectedPackage,
        clearSelectedPackages,
        
        // Query functions from store
        getOrderById: useOrdersStore.getState().getOrderById,
        getOrdersByDriverId: useOrdersStore.getState().getOrdersByDriverId,
        getOrdersByStatus: useOrdersStore.getState().getOrdersByStatus,
        getOrdersByServiceType: useOrdersStore.getState().getOrdersByServiceType,
        
        // Utility functions
        refetchOrders: ordersQuery.refetch,
        refetchUnassigned: unassignedOrdersQuery.refetch,
        invalidateOrders: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
        invalidateUnassigned: () => queryClient.invalidateQueries({ queryKey: UNASSIGNED_ORDERS_QUERY_KEY }),
    };
}
