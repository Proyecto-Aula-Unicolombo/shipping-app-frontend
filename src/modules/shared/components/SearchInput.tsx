"use client";

import { forwardRef } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Input, type InputProps } from "@/modules/shared/ui/Input";
import { cn } from "@/modules/shared/utils/cn";

export type SearchInputProps = InputProps & {
    wrapperClassName?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, wrapperClassName, type = "search", ...props }, ref) => {
        return (
            <div className={cn("relative", wrapperClassName)}>
                <Input
                    ref={ref}
                    type={type}
                    className={cn("pl-11", className)}
                    {...props}
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <HiOutlineSearch className="h-5 w-5" aria-hidden />
                </span>
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";
