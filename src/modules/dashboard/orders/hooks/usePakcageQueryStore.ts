import { PackagesListAPIResponse } from "@/types/ordersWithPackage";
import { packagesRepository } from "../repository/packageRepository";
import { useQuery, useQueryClient } from "@tanstack/react-query";


const PACKAGE_QUERY_KEY = ["packages"] as const;

interface UsePackageQueryStoreOptions {
    limit?: number;
    page?: number;
}


const fetchPackages = async (limit: number, page: number): Promise<PackagesListAPIResponse> => {
    const res = await packagesRepository.list(limit, page);
    return res;
}
export function usePackageQueryStore(options?: UsePackageQueryStoreOptions) {
    const { limit = 10, page = 1 } = options || {};
    const queryClient = useQueryClient();
    // Query for fetching packages list
    const packagesQuery = useQuery({
        queryKey: [...PACKAGE_QUERY_KEY, { limit, page }],
        queryFn: () => fetchPackages(limit, page),
        staleTime: 5 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: 'always',
    });



    return {
        packages: packagesQuery.data?.items || [],
        totalItems: packagesQuery.data?.total_items || 0,
        totalPages: packagesQuery.data?.total_pages || 1,
        currentPage: packagesQuery.data?.page || 1,
        isLoadingPackages: packagesQuery.isLoading,
        isErrorPackages: packagesQuery.isError,
        errorPackages: packagesQuery.error,


        refetchPackages: packagesQuery.refetch,
        invalidatePackages: () => queryClient.invalidateQueries({ queryKey: PACKAGE_QUERY_KEY, refetchType: "active" }),
    };
}