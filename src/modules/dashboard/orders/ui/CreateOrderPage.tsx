import { PageHeader } from "../../components/PageHeader";
import { CreateOrderForm } from "../components/CreateOrderForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";

export function CreateOrderPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Órdenes"
                    title="Creación de órdenes"
                    description="Selecciona paquetes disponibles y agrégalos a una orden"
                />
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <CreateOrderForm />
            </div>
        </div>
    );
}
