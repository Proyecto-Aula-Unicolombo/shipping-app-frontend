import { api } from '@/lib/apiClient';
import { Driver } from '@/types/domain';
import type { DriverListAPIResponse, CreateDriverDTO , DriverUnassignedAPIResponse} from '@/types/drivers';

export interface DriverListParams {
  page: number;
  limit: number;
  name_or_lastname?: string;
  role?: string;
}


export const driversRepository = {
  list: async (params?: DriverListParams): Promise<DriverListAPIResponse> => {
    const queryParams = new URLSearchParams({
      limit: params?.limit.toString() || "10",
      page: params?.page.toString() || "1",
    });

    if (params?.name_or_lastname && params.name_or_lastname.trim()) {
      queryParams.append("name_or_lastname", params.name_or_lastname.trim());
    }

    const res = await api.get(`/drivers/?${queryParams.toString()}`);
    return res.data;
  },

  listUnassigned: async (): Promise<DriverUnassignedAPIResponse[]> => {
    const res = await api.get('/drivers/unassigned');
    return res.data;
  },

  get: async (id: string): Promise<Driver> => {
    const res = await api.get(`/drivers/${id}`);
    return res.data;
  },
  create: async (payload: CreateDriverDTO): Promise<Driver> => {
    const res = await api.post('/drivers', payload);
    return res.data;
  },

  updateStatus: async (id: number, status: boolean): Promise<Driver> => {
    const res = await api.patch(`/drivers/${id}/status`, { is_active: status });
    return res.data;
  }
};