import type { ReactNode } from "react";
import { DriverLayout } from "@/modules/driver/layouts/DriverLayout";

export default function DriverGroupLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <DriverLayout>{children}</DriverLayout>;
}
