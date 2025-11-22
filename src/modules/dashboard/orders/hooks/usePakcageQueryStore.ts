import { PackageDetail, PackagesListAPIResponse } from "@/types/ordersWithPackage";
import { packagesRepository } from "../repository/packageRepository";
import { useQuery, useQueryClient } from "@tanstack/react-query";


const PACKAGE_QUERY_KEY = ["packages"] as const;
const PACKAGE_DETAIL_QUERY_KEY = (id: number) => ["packages", id] as const;

interface UsePackageQueryStoreOptions {
    limit?: number;
    page?: number;
    packageId?: number;
}


const fetchPackages = async (limit: number, page: number): Promise<PackagesListAPIResponse> => {
    const res = await packagesRepository.list(limit, page);
    return res;
}

const fetchPackageById = async (id: number): Promise<PackageDetail> => {
    const res = await packagesRepository.get(String(id))
    return res;
}

export function usePackageQueryStore(options?: UsePackageQueryStoreOptions) {
    const { limit = 10, page = 1, packageId } = options || {};
    const queryClient = useQueryClient();
    // Query for fetching packages list
    const packagesQuery = useQuery({
        queryKey: [...PACKAGE_QUERY_KEY, { limit, page }],
        queryFn: () => fetchPackages(limit, page),
        staleTime: 5 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: 'always',
    });

    const packageDetailQuery = useQuery({
        queryKey: PACKAGE_DETAIL_QUERY_KEY(packageId!),
        queryFn: () => fetchPackageById(packageId!),
        enabled: packageId !== null && packageId !== undefined && packageId > 0,
        staleTime: 0,
    });



    return {
        packages: packagesQuery.data?.items || [],
        totalItems: packagesQuery.data?.total_items || 0,
        totalPages: packagesQuery.data?.total_pages || 1,
        currentPage: packagesQuery.data?.page || 1,
        isLoadingPackages: packagesQuery.isLoading,
        isErrorPackages: packagesQuery.isError,
        errorPackages: packagesQuery.error,


        packagaDetail: packageDetailQuery.data,
        isloadingDetail: packageDetailQuery.isLoading,
        isErrorDetail: packageDetailQuery.isError,
        errorDetail: packageDetailQuery.error,


        refetchPackages: packagesQuery.refetch,
        invalidatePackages: () => queryClient.invalidateQueries({ queryKey: PACKAGE_QUERY_KEY, refetchType: "active" }),
    };
}