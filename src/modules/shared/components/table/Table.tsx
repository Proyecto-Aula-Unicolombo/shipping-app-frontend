"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";
import { cn } from "@/modules/shared/utils/cn";

export type TableColumn<T> = {
    key: keyof T | string;
    label: string;
    align?: "left" | "center" | "right";
    render?: (value: T[keyof T], row: T) => ReactNode;
    className?: string;
};

export type TableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    emptyState?: ReactNode;
    className?: string;
    rowClassName?: (row: T) => string | undefined;
    getRowKey?: (row: T, index: number) => string | number;
};

export function Table<T extends Record<string, unknown>>({
    columns,
    data,
    emptyState = "No data available",
    className,
    rowClassName,
    getRowKey,
}: TableProps<T>) {
    return (
        <div className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white", className)}>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                    <tr className="text-left text-sm font-semibold text-slate-700">
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                scope="col"
                                className={cn(
                                    "px-4 py-3",
                                    column.align === "center" && "text-center",
                                    column.align === "right" && "text-right",
                                    column.className
                                )}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                                {emptyState}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => {
                            const key = getRowKey ? getRowKey(row, index) : index;
                            return (
                                <tr key={key} className={cn("transition-colors hover:bg-slate-50", rowClassName?.(row))}>
                                    {columns.map((column) => {
                                        const value = row[column.key as keyof T];
                                        return (
                                            <td
                                                key={String(column.key)}
                                                className={cn(
                                                    "px-4 py-3 text-slate-600",
                                                    column.align === "center" && "text-center",
                                                    column.align === "right" && "text-right",
                                                    column.className
                                                )}
                                            >
                                                {column.render ? (
                                                    <Fragment>{column.render(value, row)}</Fragment>
                                                ) : (
                                                    <Fragment>{String(value ?? "")}</Fragment>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
