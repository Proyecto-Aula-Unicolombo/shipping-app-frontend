"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/modules/shared/constants/routes";
import { ordersMock } from "@/mocks/orders";
import { 
    FiTruck, 
    FiMapPin, 
    FiClock, 
    FiChevronRight,
    FiPackage
} from "react-icons/fi";

interface DriverOrdersListProps {
    driverId?: number;
}

export function DriverOrdersList({ driverId = 1 }: DriverOrdersListProps) {
    const router = useRouter();

    // Filter orders for the current driver
    const driverOrders = ordersMock.filter(order => order.DriverID === driverId);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800";
            case "en camino":
                return "bg-blue-100 text-blue-800";
            case "entregado":
                return "bg-green-100 text-green-800";
            case "cancelado":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "pendiente":
                return FiClock;
            case "en camino":
                return FiTruck;
            case "entregado":
                return FiMapPin;
            case "cancelado":
                return FiClock;
            default:
                return FiClock;
        }
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Mis Órdenes</h1>
                <p className="text-slate-600">Gestiona tus órdenes asignadas</p>
            </div>

            {/* Orders List */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
                {driverOrders.length === 0 ? (
                    <div className="text-center py-12 lg:col-span-2 xl:col-span-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiTruck size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No tienes órdenes asignadas
                        </h3>
                        <p className="text-slate-600">
                            Las nuevas órdenes aparecerán aquí cuando te sean asignadas.
                        </p>
                    </div>
                ) : (
                    driverOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.Status);
                        return (
                            <div
                                key={order.id}
                                onClick={() => router.push(ROUTES.driver.orderDetail(order.id))}
                                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <StatusIcon size={18} className="text-blue-600" />
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
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
                                        <span>ETA: {new Date(order.ETA).toLocaleString('es-ES', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}</span>
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
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
