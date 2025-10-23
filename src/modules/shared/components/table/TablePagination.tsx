"use client";

import { useId } from "react";
import { cn } from "@/modules/shared/utils/cn";

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

type TablePaginationProps<T extends number = typeof DEFAULT_PAGE_SIZE_OPTIONS[number]> = {
    page: number;
    pageSize: T;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: T) => void;
    pageSizeOptions?: readonly T[];
    className?: string;
};

export function TablePagination<T extends number = typeof DEFAULT_PAGE_SIZE_OPTIONS[number]>({
    page,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions,
    className,
}: TablePaginationProps<T>) {
    const pageSizeSelectId = useId();
    const options = (pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS) as readonly T[];
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const handlePrevious = () => {
        onPageChange(Math.max(1, page - 1));
    };

    const handleNext = () => {
        onPageChange(Math.min(totalPages, page + 1));
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value) as T;
        if (!options.includes(value)) {
            return;
        }
        onPageSizeChange(value);
    };

    return (
        <div
            className={cn(
                "flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <label htmlFor={pageSizeSelectId} className="text-sm text-slate-600">
                    Mostrar
                </label>
                <select
                    id={pageSizeSelectId}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option} por página
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between gap-4 md:justify-end">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm text-slate-600">
                    Página {page} de {totalPages}
                </span>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
