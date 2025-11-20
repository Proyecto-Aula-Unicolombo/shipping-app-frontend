import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderSchema } from "../types/orderTypes";
import { OrdersListAPIResponse, OrderListItem } from "@/types/ordersWithPackage";
import { OrderListParams, ordersRepository } from "../repository/orderRepository";


const ORDERS_QUERY_KEY = ["orders"] as const;
const UNASSIGNED_ORDERS_QUERY_KEY = ["unassigned-orders"] as const;
const ORDER_DETAIL_QUERY_KEY = (id: number) => ["orders", id] as const;


interface UseOrderQueryStoreOptions {
    listParams?: OrderListParams;
    orderrId?: number | null;
}

const fetchOrders = async (params?: OrderListParams): Promise<OrdersListAPIResponse> => {
    const res = await ordersRepository.list(params);
    return res;
};

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

    return {
        // Query data
        orders: ordersQuery.data?.items || [],
        totalItems: ordersQuery.data?.total_items || 0,
        totalPages: ordersQuery.data?.total_pages || 1,
        currentPage: ordersQuery.data?.page || 1,
        isLoadingOrders: ordersQuery.isLoading,
        isErrorOrders: ordersQuery.isError,


        // Order creation mutations
        createOrder: createOrderMutation.mutate,
        createOrderAsync: createOrderMutation.mutateAsync,
        isCreating: createOrderMutation.isPending,
        createError: createOrderMutation.error,


        // Utility functions
        refetchOrders: ordersQuery.refetch,
        invalidateOrders: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
    };
}
