"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/modules/shared/constants/routes";
import { ordersMock } from "@/mocks/orders";
import { packagesMock } from "@/mocks/orders";
import { 
    FiPackage, 
    FiTruck, 
    FiAlertTriangle,
    FiBox,
    FiCheckCircle
} from "react-icons/fi";

interface DriverPackagesListProps {
    driverId?: number;
}

export function DriverPackagesList({ driverId = 1 }: DriverPackagesListProps) {
    const router = useRouter();
    
    // Get orders for the driver
    const driverOrders = ordersMock.filter(order => order.DriverID === driverId);
    
    // Get packages for those orders
    const driverPackages = packagesMock.filter(pkg => 
        driverOrders.some(order => order.id === pkg.OrderID)
    );

    // Check if package can be delivered (not already delivered)
    const canBeDelivered = (status: string) => {
        return !["entregado", "delivered"].includes(status.toLowerCase());
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "en tránsito":
                return "bg-blue-100 text-blue-800";
            case "entregado":
                return "bg-green-100 text-green-800";
            case "en camino":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getOrderForPackage = (orderId: number) => {
        return driverOrders.find(order => order.id === orderId);
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Paquetes</h1>
                <p className="text-slate-600">Gestiona los paquetes de tus órdenes</p>
            </div>

            {/* Packages List */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
                {driverPackages.length === 0 ? (
                    <div className="text-center py-12 lg:col-span-2 xl:col-span-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No tienes paquetes asignados
                        </h3>
                        <p className="text-slate-600">
                            Los paquetes de tus órdenes aparecerán aquí.
                        </p>
                    </div>
                ) : (
                    driverPackages.map((pkg) => {
                        const order = getOrderForPackage(pkg.OrderID);
                        return (
                            <div
                                key={pkg.id}
                                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <FiPackage size={18} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                Paquete #{pkg.id}
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                Orden #{pkg.OrderID} - {order?.ClientName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.StartStatus)}`}>
                                            {pkg.StartStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <p className="text-sm text-slate-700 font-medium">
                                        {pkg.DescriptionContent}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <FiBox size={14} />
                                            <span>{pkg.Weight} kg</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiTruck size={14} />
                                            <span>{pkg.TypePackage}</span>
                                        </div>
                                    </div>
                                </div>

                                {pkg.IsFragile && (
                                    <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                                        <FiAlertTriangle size={14} className="text-amber-600" />
                                        <span className="text-sm text-amber-700 font-medium">
                                            Frágil - Manejar con cuidado
                                        </span>
                                    </div>
                                )}

                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <div className="flex justify-between items-center text-sm mb-3">
                                        <span className="text-slate-600">Valor declarado:</span>
                                        <span className="font-medium text-slate-900">
                                            ${pkg.DeclaredValue.toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    {/* Botón de entrega solo para paquetes sin entregar */}
                                    {canBeDelivered(pkg.StartStatus) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(ROUTES.driver.confirmDelivery(pkg.id));
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            <FiCheckCircle size={16} />
                                            <span className="font-medium">Confirmar Entrega</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
