"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/modules/shared/utils/cn";

const toneStyles = {
    neutral: {
        wrapper:
            "border border-slate-200 bg-white hover:bg-slate-100 focus-visible:ring-slate-300",
        icon: "bg-slate-100 text-slate-600",
        action: "text-slate-600",
    },
    primary: {
        wrapper:
            "border border-blue-100 bg-blue-50 hover:bg-blue-100 focus-visible:ring-blue-200",
        icon: "bg-blue-100 text-blue-600",
        action: "text-blue-600",
    },
    success: {
        wrapper:
            "border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 focus-visible:ring-emerald-200",
        icon: "bg-emerald-100 text-emerald-600",
        action: "text-emerald-600",
    },
    warning: {
        wrapper:
            "border border-amber-100 bg-amber-50 hover:bg-amber-100 focus-visible:ring-amber-200",
        icon: "bg-amber-100 text-amber-600",
        action: "text-amber-600",
    },
    danger: {
        wrapper:
            "border border-rose-100 bg-rose-50 hover:bg-rose-100 focus-visible:ring-rose-200",
        icon: "bg-rose-100 text-rose-600",
        action: "text-rose-600",
    },
} as const;

export type ActionCardTone = keyof typeof toneStyles;

export type ActionCardProps = {
    title: string;
    description: string;
    icon?: ReactNode;
    tone?: ActionCardTone;
    actionLabel?: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    className?: string;
};

export function ActionCard({
    title,
    description,
    icon,
    tone = "neutral",
    actionLabel,
    onClick,
    href,
    disabled,
    className,
}: ActionCardProps) {
    const variant = toneStyles[tone];

    const content = (
        <div className={cn("flex w-full items-start gap-4", disabled && "pointer-events-none opacity-60")}
        >
            {icon ? (
                <span
                    aria-hidden
                    className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-xl", variant.icon)}
                >
                    {icon}
                </span>
            ) : null}

            <div className="flex flex-1 flex-col items-start gap-3">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="text-sm leading-6 text-slate-600">{description}</p>
                </div>

                {actionLabel ? (
                    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", variant.action)}>
                        {actionLabel}
                        <span aria-hidden>→</span>
                    </span>
                ) : null}
            </div>
        </div>
    );

    const baseClass = cn(
        "cursor-pointer group flex w-full rounded-2xl p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2",
        variant.wrapper,
        className
    );

    if (href) {
        return (
            <Link href={href} onClick={onClick} className={baseClass}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(baseClass, "items-start")}
        >
            {content}
        </button>
    );
}
