import { api } from '@/lib/apiClient';
import { Orders } from '@/types/domain';
import type { OrdersListAPIResponse, CreateOrderDTO, UpdateOrderDTO } from '@/types/ordersWithPackage';

export interface OrderListParams {
    page: number;
    limit: number;
    type_service?: string;
    status?: string;
    order_id?: string;
}


export const ordersRepository = {
    list: async (params?: OrderListParams): Promise<OrdersListAPIResponse> => {
        const queryParams = new URLSearchParams({
            limit: params?.limit.toString() || "10",
            page: params?.page.toString() || "1",
        });

        if (params?.type_service && params.type_service.trim()) {
            queryParams.append("type_service", params.type_service.trim());
        }

        if (params?.status && params.status !== "all") {
            queryParams.append("status", params.status);
        }
        if (params?.order_id) {
            queryParams.append("order_id", params.order_id.toString());
        }
        const res = await api.get(`/orders/?${queryParams.toString()}`);
        return res.data;
    },

    get: async (id: string): Promise<Orders> => {
        const res = await api.get(`/orders/${id}`);
        return res.data;
    },
    create: async (payload: CreateOrderDTO): Promise<Orders> => {
        const res = await api.post('/orders', payload);
        return res.data;
    },
    update: async (id: string, payload: UpdateOrderDTO): Promise<Orders> => {
        const res = await api.put(`/orders/${id}`, payload);
        return res.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/orders/${id}`);
    },

};