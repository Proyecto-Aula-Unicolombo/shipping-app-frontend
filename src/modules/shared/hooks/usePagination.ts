"use client";

import { useEffect, useMemo, useState } from "react";

type UsePaginationOptions<T extends number = number> = {
    totalItems: number;
    initialPage?: number;
    initialPageSize?: T;
    pageSizeOptions?: readonly T[];
};

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

export function usePagination<T extends number = typeof DEFAULT_PAGE_SIZE_OPTIONS[number]>({
    totalItems,
    initialPage = 1,
    initialPageSize,
    pageSizeOptions,
}: UsePaginationOptions<T>) {
    const resolvedOptions = (pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS) as unknown as readonly T[];
    const defaultPageSize = initialPageSize ?? (resolvedOptions[0] as T);
    const [page, setPageState] = useState(initialPage);
    const [pageSize, setPageSizeState] = useState<T>(defaultPageSize);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);

    useEffect(() => {
        setPageState((current) => Math.min(Math.max(1, current), totalPages));
    }, [totalPages]);

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const goToPage = (nextPage: number) => {
        if (Number.isNaN(nextPage)) return;
        setPageState(() => {
            const clamped = Math.min(Math.max(1, Math.floor(nextPage)), totalPages);
            return clamped;
        });
    };

    const changePageSize = (size: T) => {
        setPageSizeState(size);
        setPageState(1);
    };

    const resetPage = () => setPageState(1);

    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        pageSizeOptions: resolvedOptions,
        offset,
        limit,
        goToPage,
        setPage: goToPage,
        setPageSize: changePageSize,
        resetPage,
    };
}
