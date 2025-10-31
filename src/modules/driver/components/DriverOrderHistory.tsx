"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/modules/shared/constants/routes";
import { ordersMock } from "@/mocks/orders";
import { 
    FiMapPin, 
    FiClock, 
    FiChevronRight,
    FiPackage,
    FiCheckCircle
} from "react-icons/fi";

interface DriverOrderHistoryProps {
    driverId?: number;
}

export function DriverOrderHistory({ driverId = 1 }: DriverOrderHistoryProps) {
    const router = useRouter();

    // Filter delivered orders for the current driver
    const deliveredOrders = ordersMock.filter(order => 
        order.DriverID === driverId && order.Status.toLowerCase() === "entregado"
    );

    const getStatusColor = () => {
        return "bg-green-100 text-green-800"; // All are delivered
    };

    const formatDeliveryDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Historial</h1>
                <p className="text-slate-600">Historial de todas tus entregas completadas</p>
            </div>

            {/* Orders List */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
                {deliveredOrders.length === 0 ? (
                    <div className="text-center py-12 lg:col-span-2 xl:col-span-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No tienes entregas completadas
                        </h3>
                        <p className="text-slate-600">
                            Tus entregas completadas aparecerán aquí.
                        </p>
                    </div>
                ) : (
                    deliveredOrders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => router.push(ROUTES.driver.orderDetail(order.id))}
                            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <FiCheckCircle size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Orden #{order.id}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            {order.ClientName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                                        {order.Status}
                                    </span>
                                    <FiChevronRight size={16} className="text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <FiMapPin size={14} />
                                    <span>{order.DeliveryAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <FiClock size={14} />
                                    <span>Entregado: {formatDeliveryDate(order.ETA)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <FiPackage size={14} />
                                    <span>{order.ServiceType}</span>
                                </div>
                            </div>

                            {order.Notes && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-700">
                                        <span className="font-medium">Nota:</span> {order.Notes}
                                    </p>
                                </div>
                            )}

                            {/* Delivery confirmation badge */}
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex items-center gap-1 text-green-600">
                                    <FiCheckCircle size={14} />
                                    <span className="text-xs font-medium">Entrega confirmada</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
