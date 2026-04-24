import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { useOrderQueryStore } from "../hooks/useOrderQueryStore";
import { ROUTES } from "@/modules/shared/constants/routes";
import Link from "next/link";

export function OrdersListPage() {
    const {
        orders,
        unassignedOrders,
        isLoading,
        isError,
        error
    } = useOrderQueryStore();

    if (isLoading) {
        return (
            <div className="space-y-8">
                <PageHeader eyebrow="Órdenes" title="Órdenes" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-500">Cargando órdenes...</div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                <PageHeader eyebrow="Órdenes" title="Órdenes" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-red-500">
                        Error al cargar órdenes: {error?.message || "Error desconocido"}
                    </div>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Entregado":
                return "bg-emerald-50 text-emerald-700";
            case "En camino":
                return "bg-blue-50 text-blue-700";
            case "Pendiente":
                return "bg-amber-50 text-amber-600";
            case "Cancelada":
                return "bg-red-50 text-red-700"
            default:
                return "bg-slate-50 text-slate-600";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <PageHeader eyebrow="Órdenes" title="Órdenes" />
                <Link href={ROUTES.dashboard.createOrder}>
                    <Button className="px-6">
                        Crear Orden
                    </Button>
                </Link>
            </div>

            {/* Orders with Drivers */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Órdenes Asignadas</h2>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                        <div className="grid grid-cols-7 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <div>ID Orden</div>
                            <div>Cliente</div>
                            <div>Dirección</div>
                            <div>Tipo Servicio</div>
                            <div>Estado</div>
                            <div>Fecha Entrega</div>
                            <div>Conductor</div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {orders.filter(order => order.DriverID).map((order) => (
                            <div key={order.id} className="px-6 py-4 hover:bg-slate-50">
                                <div className="grid grid-cols-7 gap-4 items-center">
                                    <div className="text-sm font-medium text-slate-900">#{order.id}</div>
                                    <div className="text-sm text-slate-600">{order.ClientName}</div>
                                    <div className="text-sm text-slate-600">{order.DeliveryAddress}</div>
                                    <div className="text-sm text-slate-600">{order.ServiceType}</div>
                                    <div>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.Status)}`}>
                                            {order.Status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">{order.ETA}</div>
                                    <div className="text-sm text-slate-600">
                                        {order.DriverID ? `Conductor #${order.DriverID}` : "Sin asignar"}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {orders.filter(order => order.DriverID).length === 0 && (
                            <div className="px-6 py-8 text-center text-slate-500">
                                No hay órdenes asignadas
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Unassigned Orders */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Órdenes Sin Asignar</h2>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                        <div className="grid grid-cols-6 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <div>ID Orden</div>
                            <div>Cliente</div>
                            <div>Dirección</div>
                            <div>Tipo Servicio</div>
                            <div>Estado</div>
                            <div>Fecha Entrega</div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {orders.filter(order => !order.DriverID).map((order) => (
                            <div key={order.id} className="px-6 py-4 hover:bg-slate-50">
                                <div className="grid grid-cols-6 gap-4 items-center">
                                    <div className="text-sm font-medium text-slate-900">#{order.id}</div>
                                    <div className="text-sm text-slate-600">{order.ClientName}</div>
                                    <div className="text-sm text-slate-600">{order.DeliveryAddress}</div>
                                    <div className="text-sm text-slate-600">{order.ServiceType}</div>
                                    <div>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.Status)}`}>
                                            {order.Status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">{order.ETA}</div>
                                </div>
                            </div>
                        ))}
                        {unassignedOrders.map((order) => (
                            <div key={order.id} className="px-6 py-4 hover:bg-slate-50">
                                <div className="grid grid-cols-6 gap-4 items-center">
                                    <div className="text-sm font-medium text-slate-900">#{order.id}</div>
                                    <div className="text-sm text-slate-600">{order.ClientName}</div>
                                    <div className="text-sm text-slate-600">{order.DeliveryAddress}</div>
                                    <div className="text-sm text-slate-600">{order.ServiceType}</div>
                                    <div>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.Status)}`}>
                                            {order.Status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">{order.ETA}</div>
                                </div>
                            </div>
                        ))}
                        {orders.filter(order => !order.DriverID).length === 0 && unassignedOrders.length === 0 && (
                            <div className="px-6 py-8 text-center text-slate-500">
                                No hay órdenes sin asignar
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
