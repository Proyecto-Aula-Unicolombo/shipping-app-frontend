"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { usePackageQueryStore } from "../../orders/hooks/usePakcageQueryStore";

// Status type from API (lowercase)
type PackageStatus = "pendiente" | "asignado" | "en camino" | "entregado" | "cancelado";

// Format status from API (lowercase) to display (capitalized)
const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        "pendiente": "Pendiente",
        "asignado": "Asignado",
        "en camino": "En Camino",
        "entregado": "Entregado",
        "cancelado": "Cancelado",
        "incidente": "Incidente",
    };
    return statusMap[status.toLowerCase()] || status;
};

// Helper function to format Base64 images
const formatBase64Image = (base64String: string): string => {
    if (base64String.startsWith('data:image/')) {
        return base64String;
    }
    return `data:image/png;base64,${base64String}`;
};

const STATUS_STYLES: Record<string, string> = {
    "pendiente": "bg-amber-50 text-amber-600",
    "asignado": "bg-indigo-50 text-indigo-700",
    "en camino": "bg-blue-50 text-blue-700",
    "entregado": "bg-emerald-50 text-emerald-700",
    "cancelado": "bg-red-50 text-red-700",
    "incidente": "bg-orange-50 text-orange-700",
};

export default function PackageDetailPage() {
    const params = useParams();
    const packageId = parseInt(params.packageId as string);

    const { packagaDetail: packageData, isloadingDetail, isErrorDetail } = usePackageQueryStore({
        packageId
    });

    if (isloadingDetail) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-600">Cargando detalles del paquete...</p>
                </div>
            </div>
        );
    }

    if (isErrorDetail || !packageData) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader eyebrow="Paquetes" title="Paquete no encontrado" />
                </div>
                <div className="text-center py-12">
                    <p className="text-slate-600">El paquete solicitado no existe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Paquetes" title={`Paquete #${packageData.NumPackage}`} />
                    <p className="text-sm text-slate-600 mt-1">
                        Creado el {new Date(packageData.CreatedAt).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Detalles del Paquete</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[packageData.Status.toLowerCase()] || 'bg-gray-50 text-gray-700'}`}>
                                {formatStatus(packageData.Status)}
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Destinatario</label>
                            <p className="text-sm text-slate-900">
                                {packageData.Receiver.name} {packageData.Receiver.last_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {packageData.Receiver.email}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Teléfono: {packageData.Receiver.phone_number}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección de Entrega</label>
                            <p className="text-sm text-slate-900">
                                {packageData.AddressPackage.destination}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Origen: {packageData.AddressPackage.origin}
                            </p>
                        </div>

                        {packageData.Sender && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Remitente</label>
                                <p className="text-sm text-slate-900">
                                    {packageData.Sender.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {packageData.Sender.email}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Peso Total</label>
                            <p className="text-sm text-slate-900">{packageData.Weight} kg</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Dimensiones</label>
                            <p className="text-sm text-slate-900">
                                {packageData.Dimension} cm
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Valor Declarado</label>
                            <p className="text-sm text-slate-900">
                                ${packageData.ComercialInformation.cost_sending.toLocaleString('es-CO')}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Pago: {packageData.ComercialInformation.is_paid ? 'Pagado' : 'Por Cobrar'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contenido</label>
                            <p className="text-sm text-slate-900">{packageData.DescriptionContent}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Paquete</label>
                            <p className="text-sm text-slate-900">{packageData.TypePackage}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Information - Show based on status */}
            {packageData.DeliveryInformation && (packageData.Status.toLowerCase() === "entregado" || packageData.Status.toLowerCase() === "cancelado" || packageData.Status.toLowerCase() === "incidente") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">
                        {packageData.Status.toLowerCase() === "entregado" && "Prueba de Entrega (POD)"}
                        {packageData.Status.toLowerCase() === "incidente" && "Información del Incidente"}
                        {packageData.Status.toLowerCase() === "cancelado" && "Información de Cancelación"}
                    </h3>

                    <div className="space-y-6">

                        {packageData.Status.toLowerCase() === "entregado" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        📸 Foto de Entrega
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">
                                        Foto tomada por el conductor al momento de la entrega
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 overflow-hidden">
                                        <img
                                            src={formatBase64Image(packageData.DeliveryInformation.PhotoDelivery)}
                                            alt="Foto de entrega del paquete"
                                            className="w-full max-w-2xl h-auto rounded-lg shadow-sm object-contain"
                                            style={{ maxHeight: '500px' }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="%2364748b" font-family="sans-serif" font-size="14">Imagen no disponible</text></svg>';
                                            }}
                                        />
                                    </div>
                                </div>

                                {packageData.DeliveryInformation.SignatureReceived && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">
                                            ✍️ Firma del Receptor
                                        </label>
                                        <p className="text-xs text-slate-500 mb-2">
                                            Firma del destinatario
                                        </p>
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 overflow-hidden">
                                            <div className="bg-white rounded border border-slate-300 p-2 inline-block max-w-full">
                                                <img
                                                    src={formatBase64Image(packageData.DeliveryInformation.SignatureReceived)}
                                                    alt="Firma digital del receptor"
                                                    className="w-full max-w-md h-auto object-contain"
                                                    style={{ maxHeight: '200px' }}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><rect fill="%23ffffff" stroke="%23cbd5e1"/><text x="50%" y="50%" text-anchor="middle" fill="%2364748b" font-family="sans-serif" font-size="12">Firma no disponible</text></svg>';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {packageData.DeliveryInformation.Observation && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            📝 Observaciones del Conductor
                                        </label>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-slate-900">
                                                {packageData.DeliveryInformation.Observation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <span className="text-xl">✅</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-emerald-900 mb-1">Paquete Entregado Exitosamente</h4>
                                            <p className="text-sm text-emerald-700">
                                                El paquete fue entregado al destinatario {packageData.Receiver.name} {packageData.Receiver.last_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {packageData.Status.toLowerCase() === "incidente" && (
                            <>
                                {packageData.DeliveryInformation.ReasonCancellation && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            ⚠️ Descripción del Incidente
                                        </label>
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                            <p className="text-sm text-orange-900 font-medium">
                                                {packageData.DeliveryInformation.ReasonCancellation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {packageData.DeliveryInformation.PhotoDelivery && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">
                                            📸 Foto del Incidente
                                        </label>
                                        <p className="text-xs text-slate-500 mb-2">
                                            Foto tomada por el conductor del incidente
                                        </p>
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 overflow-hidden">
                                            <img
                                                src={formatBase64Image(packageData.DeliveryInformation.PhotoDelivery)}
                                                alt="Foto del incidente"
                                                className="w-full max-w-2xl h-auto rounded-lg shadow-sm object-contain"
                                                style={{ maxHeight: '500px' }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="%2364748b" font-family="sans-serif" font-size="14">Imagen no disponible</text></svg>';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {packageData.DeliveryInformation.Observation && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            📝 Observaciones Adicionales
                                        </label>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-slate-900">
                                                {packageData.DeliveryInformation.Observation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <span className="text-xl">⚠️</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-orange-900 mb-1">Incidente Reportado</h4>
                                            <p className="text-sm text-orange-700">
                                                Se ha reportado un incidente con este paquete
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {packageData.Status.toLowerCase() === "cancelado" && (
                            <>
                                {packageData.DeliveryInformation.ReasonCancellation && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            ❌ Razón de Cancelación
                                        </label>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-sm text-red-900 font-medium">
                                                {packageData.DeliveryInformation.ReasonCancellation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {packageData.DeliveryInformation.Observation && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            📝 Observaciones
                                        </label>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-slate-900">
                                                {packageData.DeliveryInformation.Observation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-xl">❌</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-red-900 mb-1">Entrega Cancelada</h4>
                                            <p className="text-sm text-red-700">
                                                Este paquete no pudo ser entregado y fue marcado como cancelado
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
