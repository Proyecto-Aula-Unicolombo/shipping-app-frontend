import { DriverOrderDetailPage } from "@/modules/driver/pages/DriverOrderDetailPage";

interface DriverOrderDetailRouteProps {
    params: {
        orderId: string;
    };
}

export default function DriverOrderDetailRoute({ params }: DriverOrderDetailRouteProps) {
    return <DriverOrderDetailPage />;
}
