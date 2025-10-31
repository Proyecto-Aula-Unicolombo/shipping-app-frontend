"use client";

import { useParams, useRouter } from "next/navigation";
import { ordersMock } from "@/mocks/orders";
import { packagesMock } from "@/mocks/orders";
import { ROUTES } from "@/modules/shared/constants/routes";
import { 
    FiArrowLeft,
    FiTruck, 
    FiMapPin, 
    FiClock, 
    FiPhone,
    FiUser,
    FiPackage,
    FiAlertTriangle,
    FiBox
} from "react-icons/fi";

export function DriverOrderDetail() {
    const params = useParams();
    const router = useRouter();
    const orderId = parseInt(params.orderId as string);

    const order = ordersMock.find(o => o.id === orderId);
    const orderPackages = packagesMock.filter(pkg => pkg.OrderID === orderId);

    if (!order) {
        return (
            <div className="p-4 lg:p-8">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiTruck size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Orden no encontrada
                    </h3>
                    <p className="text-slate-600 mb-6">
                        No se pudo encontrar la orden #{orderId}
                    </p>
                    <button
                        onClick={() => router.push(ROUTES.driver.orders)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver a órdenes
                    </button>
                </div>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(ROUTES.driver.orders)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <FiArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">
                                Orden #{order.id}
                            </h1>
                            <p className="text-sm text-slate-600">{order.ClientName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-xl p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${getStatusColor(order.Status)}`}>
                            <FiTruck size={16} />
                            <span className="text-sm font-medium">{order.Status}</span>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-white rounded-xl p-4 space-y-4">
                        <h2 className="font-semibold text-slate-900">Información de la orden</h2>
                        
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FiUser size={16} className="text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-900">Cliente</p>
                                    <p className="text-sm text-slate-600">{order.ClientName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiMapPin size={16} className="text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-900">Dirección de entrega</p>
                                    <p className="text-sm text-slate-600">{order.DeliveryAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiClock size={16} className="text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-900">ETA</p>
                                    <p className="text-sm text-slate-600">
                                        {new Date(order.ETA).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiPhone size={16} className="text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-900">Teléfono de contacto</p>
                                    <p className="text-sm text-slate-600">{order.ContactPhone}</p>
                                </div>
                            </div>
                        </div>

                        {order.Notes && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700">
                                    <span className="font-medium">Nota:</span> {order.Notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Packages */}
                    <div className="bg-white rounded-xl p-4">
                        <h2 className="font-semibold text-slate-900 mb-4">
                            Paquetes ({orderPackages.length})
                        </h2>
                        
                        <div className="space-y-3">
                            {orderPackages.map((pkg) => (
                                <div key={pkg.id} className="border border-slate-200 rounded-lg p-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <FiPackage size={16} className="text-green-600" />
                                            <span className="font-medium text-slate-900">
                                                Paquete #{pkg.id}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(pkg.StartStatus)}`}>
                                            {pkg.StartStatus}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-slate-700 mb-2">
                                        {pkg.DescriptionContent}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 text-xs text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <FiBox size={12} />
                                            <span>{pkg.Weight} kg</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiTruck size={12} />
                                            <span>{pkg.TypePackage}</span>
                                        </div>
                                        <span>${pkg.DeclaredValue.toLocaleString()}</span>
                                    </div>

                                    {pkg.IsFragile && (
                                        <div className="flex items-center gap-1 mt-2 text-amber-600">
                                            <FiAlertTriangle size={12} />
                                            <span className="text-xs font-medium">Frágil</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                <div className="max-w-6xl mx-auto p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => router.push(ROUTES.driver.orders)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <FiArrowLeft size={24} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Orden #{order.id}
                            </h1>
                            <p className="text-slate-600">{order.ClientName}</p>
                        </div>
                        <div className="ml-auto">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.Status)}`}>
                                <FiTruck size={18} />
                                <span className="font-medium">{order.Status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Information */}
                        <div className="bg-white rounded-xl p-6 h-fit">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">
                                Información de la orden
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FiUser size={20} className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Cliente</p>
                                        <p className="text-slate-600">{order.ClientName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FiMapPin size={20} className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Dirección de entrega</p>
                                        <p className="text-slate-600">{order.DeliveryAddress}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FiClock size={20} className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-900">ETA</p>
                                        <p className="text-slate-600">
                                            {new Date(order.ETA).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FiPhone size={20} className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Teléfono de contacto</p>
                                        <p className="text-slate-600">{order.ContactPhone}</p>
                                    </div>
                                </div>
                            </div>

                            {order.Notes && (
                                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                                    <p className="text-slate-700">
                                        <span className="font-semibold">Nota:</span> {order.Notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Packages */}
                        <div className="bg-white rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">
                                Paquetes ({orderPackages.length})
                            </h2>
                            
                            <div className="space-y-4">
                                {orderPackages.map((pkg) => (
                                    <div key={pkg.id} className="border border-slate-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <FiPackage size={18} className="text-green-600" />
                                                <span className="font-semibold text-slate-900">
                                                    Paquete #{pkg.id}
                                                </span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.StartStatus)}`}>
                                                {pkg.StartStatus}
                                            </span>
                                        </div>
                                        
                                        <p className="text-slate-700 mb-3">
                                            {pkg.DescriptionContent}
                                        </p>
                                        
                                        <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                                            <div className="flex items-center gap-2">
                                                <FiBox size={14} />
                                                <span>{pkg.Weight} kg</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiTruck size={14} />
                                                <span>{pkg.TypePackage}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {pkg.IsFragile && (
                                                    <div className="flex items-center gap-1 text-amber-600">
                                                        <FiAlertTriangle size={14} />
                                                        <span className="text-sm font-medium">Frágil</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-semibold text-slate-900">
                                                ${pkg.DeclaredValue.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
