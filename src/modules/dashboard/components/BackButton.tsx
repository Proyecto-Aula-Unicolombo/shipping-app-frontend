"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            aria-label="Volver"
            className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 cursor-pointer text-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
            <FaArrowLeft />
        </button>
    );
}
