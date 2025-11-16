import { ConfirmDeliveryForm } from "../components/ConfirmDeliveryForm";

interface ConfirmDeliveryPageProps {
    packageId: number;
}

export function ConfirmDeliveryPage({ packageId }: ConfirmDeliveryPageProps) {
    return <ConfirmDeliveryForm packageId={packageId} />;
}
