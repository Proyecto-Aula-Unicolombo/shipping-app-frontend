"use client";

import type { ReactNode } from "react";
import type {
    FieldValues,
    SubmitHandler,
    UseFormReturn,
} from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { cn } from "@/modules/shared/utils/cn";

type FormProps<TFieldValues extends FieldValues> = {
    form: UseFormReturn<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
    children: ReactNode;
    className?: string;
};

export function Form<TFieldValues extends FieldValues>({
    form,
    onSubmit,
    children,
    className,
}: FormProps<TFieldValues>) {
    return (
        <FormProvider {...form}>
            <form
                className={cn("space-y-6", className)}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {children}
            </form>
        </FormProvider>
    );
}
