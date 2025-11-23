import { api } from '@/lib/apiClient';

export interface Incident {
    id: number;
    order_id: number;
    latitude: number;
    longitude: number;
    type_stop: string;
    description: string | null;
    evidence: string | null;
    timestamp: string;
    status: string;
    driver_id?: number;
    driver_name?: string;
    driver_lastname?: string;
}

export interface IncidentsListResponse {
    data: Incident[];
    count: number;
}

export interface IncidentListParams {
    status?: string;
    driver_id?: number;
    order_id?: number;
    limit?: number;
    offset?: number;
}

export const incidentsRepository = {
    list: async (params?: IncidentListParams): Promise<IncidentsListResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.status) {
            queryParams.append('status', params.status);
        }
        if (params?.driver_id) {
            queryParams.append('driver_id', params.driver_id.toString());
        }
        if (params?.order_id) {
            queryParams.append('order_id', params.order_id.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.offset) {
            queryParams.append('offset', params.offset.toString());
        }

        const res = await api.get(`/incidents?${queryParams.toString()}`);
        return res.data;
    },

    get: async (id: number): Promise<Incident> => {
        const res = await api.get(`/incidents/${id}`);
        return res.data;
    },
};
