import { api } from '@/lib/apiClient';
import {  Vehicle } from '@/types/domain';
import { CreateVehicleDTO, UpdateVehicleDTO, VehicleListAPIResponse, VehicleLListUnassignedAPIResponse } from '@/types/vehicles';

export interface VehicleListParams {
  page: number;
  limit: number;
  plate_brand_or_model?: string;
}


export const vehiclesRepository = {
  list: async (params?: VehicleListParams): Promise<VehicleListAPIResponse> => {
    const queryParams = new URLSearchParams({
      limit: params?.limit.toString() || "10",
      page: params?.page.toString() || "1",
    });
    
    if (params?.plate_brand_or_model && params.plate_brand_or_model.trim()) {
      queryParams.append("plate_brand_or_model", params.plate_brand_or_model.trim());
    }
    const res = await api.get(`/vehicles/?${queryParams.toString()}`);
    return res.data;
  },
  
  listUnassigned: async (): Promise<VehicleLListUnassignedAPIResponse[]> => {
    const res = await api.get('/vehicles/unassigned');
    return res.data;
  },

  get: async (id: string): Promise<Vehicle> => {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  },
  create: async (payload: CreateVehicleDTO): Promise<Vehicle> => {
    const res = await api.post('/vehicles', payload);
    return res.data;
  },
  update: async (id: string, payload: UpdateVehicleDTO): Promise<Vehicle> => {
    const res = await api.put(`/vehicles/${id}`, payload);
    return res.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};