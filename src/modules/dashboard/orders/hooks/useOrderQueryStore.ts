import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderSchema } from "../types/orderTypes";
import { OrdersListAPIResponse, OrderListItem, OrderDetailResponse } from "@/types/ordersWithPackage";
import { OrderListParams, ordersRepository } from "../repository/orderRepository";


const ORDERS_QUERY_KEY = ["orders"] as const;
const UNASSIGNED_ORDERS_QUERY_KEY = ["unassigned-orders"] as const;
const ORDER_DETAIL_QUERY_KEY = (id: number) => ["orders", id] as const;


interface UseOrderQueryStoreOptions {
    listParams?: OrderListParams;
    orderrId?: number | null;
    driverId?: number | undefined;
    vehicleId?: number | undefined;
}

const fetchOrders = async (params?: OrderListParams): Promise<OrdersListAPIResponse> => {
    const res = await ordersRepository.list(params);
    return res;
};

const fetchOrderById = async (id: number): Promise<OrderDetailResponse> => {
    const res = await ordersRepository.get(String(id));
    return (res as unknown) as OrderDetailResponse;
}

const fetchOrdersUnassigned = async (params?: OrderListParams): Promise<OrdersListAPIResponse> => {
    const res = await ordersRepository.listOrdersUnassigned(params);
    return res;
}

const createOrderAPI = async (data: CreateOrderSchema): Promise<OrderListItem> => {
    const payload: any = {
        observation: data.notes || "",
        driver_id: data.driverId,
        vehicle_id: data.vehicleId,
        package_ids: data.package_ids.map(id => Number(id)),
        type_service: data.serviceType,
    }

    const res = await ordersRepository.create(payload);
    return (res as unknown) as OrderListItem;
};

const assignOrderAPI = async (params?: UseOrderQueryStoreOptions): Promise<OrderListItem> => {
    if (!params?.orderrId || params.driverId === undefined || params.vehicleId === undefined) {
        throw new Error('Missing required parameters for order assignment');
    }
    const res = await ordersRepository.assignOrder(String(params.orderrId), params.driverId, params.vehicleId);
    return (res as unknown) as OrderListItem;
};

export function useOrderQueryStore(options?: UseOrderQueryStoreOptions) {
    const { listParams, orderrId } = options || {};
    const queryClient = useQueryClient();


    // Query for fetching orders list
    const ordersQuery = useQuery({
        queryKey: [...ORDERS_QUERY_KEY, listParams],
        queryFn: () => fetchOrders(listParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData
    });

    const orderDetailQuery = useQuery({
        queryKey: ORDER_DETAIL_QUERY_KEY(orderrId!),
        queryFn: () => fetchOrderById(orderrId!),
        enabled: orderrId !== null && orderrId !== undefined && orderrId > 0,
        staleTime: 0,
    });

    const ordersUnassignedQuery = useQuery({
        queryKey: [...UNASSIGNED_ORDERS_QUERY_KEY, listParams],
        queryFn: () => fetchOrdersUnassigned(listParams),
        staleTime: 0,
    });


    // Mutation for creating order
    const createOrderMutation = useMutation({
        mutationFn: createOrderAPI,
        onSuccess: () => {
            // Invalidate and refetch orders to get updated data
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: "active" });

            queryClient.invalidateQueries({ queryKey: UNASSIGNED_ORDERS_QUERY_KEY, refetchType: "active" });
            queryClient.invalidateQueries({
                queryKey: ["packages"],
                refetchType: 'active',
            });
        },
        onError: (error) => {
            console.error("Error creating order:", error);
        },
    });

    const assignOrderMutation = useMutation({
        mutationFn: assignOrderAPI,
        onSuccess: (_, variables) => {
            // Invalidate and refetch orders to get updated data
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: "active" });

            queryClient.invalidateQueries({ queryKey: UNASSIGNED_ORDERS_QUERY_KEY, refetchType: "active" });
            if (variables?.orderrId) {
                queryClient.invalidateQueries({ queryKey: ORDER_DETAIL_QUERY_KEY(variables.orderrId), refetchType: "active" });
            }

        },
        onError: (error) => {
            console.error("Error assigning order:", error);
        },
    });

    return {
        // Query data
        orders: ordersQuery.data?.items || [],
        totalItems: ordersQuery.data?.total_items || 0,
        totalPages: ordersQuery.data?.total_pages || 1,
        currentPage: ordersQuery.data?.page || 1,
        isLoadingOrders: ordersQuery.isLoading,
        isErrorOrders: ordersQuery.isError,

        // Order detail data
        orderDetail: orderDetailQuery.data,
        isLoadingOrderDetail: orderDetailQuery.isLoading,
        isErrorOrderDetail: orderDetailQuery.isError,

        // Orders unassigned data
        ordersUnassigned: ordersUnassignedQuery.data?.items || [],
        totalItemsUnassigned: ordersUnassignedQuery.data?.total_items || 0,
        totalPagesUnassigned: ordersUnassignedQuery.data?.total_pages || 1,
        currentPageUnassigned: ordersUnassignedQuery.data?.page || 1,
        isLoadingOrdersUnassigned: ordersUnassignedQuery.isLoading,
        isErrorOrdersUnassigned: ordersUnassignedQuery.isError,

        // Order creation mutations
        createOrder: createOrderMutation.mutate,
        createOrderAsync: createOrderMutation.mutateAsync,
        isCreating: createOrderMutation.isPending,
        createError: createOrderMutation.error,

        // Order assignment mutations
        assignOrder: assignOrderMutation.mutate,
        assignOrderAsync: assignOrderMutation.mutateAsync,
        isAssigning: assignOrderMutation.isPending,
        assignError: assignOrderMutation.error,

        // Utility functions
        refetchOrders: ordersQuery.refetch,
        invalidateOrders: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
    };
}
