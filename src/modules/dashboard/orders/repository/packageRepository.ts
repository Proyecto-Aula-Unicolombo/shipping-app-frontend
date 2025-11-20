import { api } from '@/lib/apiClient';
import type {
    PackagesListAPIResponse,
    PackageDetail,
} from '@/types/ordersWithPackage';

export const packagesRepository = {
    list: async (limit: number, page: number): Promise<PackagesListAPIResponse> => {
        const queryParams = new URLSearchParams({
            limit: limit.toString() || "10",
            page: page.toString() || "1",
        });
        
        const res = await api.get(`/packages/?${queryParams.toString()}`);
        return res.data;
    },

    get: async (id: string): Promise<PackageDetail> => {
        const res = await api.get(`/packages/${id}`);
        return res.data;
    },

};
