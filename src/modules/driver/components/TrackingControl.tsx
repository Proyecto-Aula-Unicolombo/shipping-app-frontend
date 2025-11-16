"use client";

import { useState, useEffect } from "react";
import { 
    FiNavigation, 
    FiPlay, 
    FiPause, 
    FiMapPin,
    FiClock,
    FiTruck,
    FiCheckCircle
} from "react-icons/fi";
import { Button } from "@/modules/shared/ui/Button";

interface TrackingControlProps {
    driverId?: number;
}

export function TrackingControl({ driverId = 1 }: TrackingControlProps) {
    const [isTracking, setIsTracking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Actualizar el tiempo cada segundo cuando el tracking está activo
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isTracking && trackingStartTime) {
            interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isTracking, trackingStartTime]);

    const handleToggleTracking = async () => {
        setIsLoading(true);
        
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (isTracking) {
                // Detener tracking
                setIsTracking(false);
                setTrackingStartTime(null);
            } else {
                // Iniciar tracking
                setIsTracking(true);
                setTrackingStartTime(new Date());
            }
        } catch (error) {
            console.error("Error al cambiar estado de tracking:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTrackingTime = () => {
        if (!trackingStartTime) return "00:00:00";
        
        const diff = currentTime.getTime() - trackingStartTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Control de Tracking</h1>
                <p className="text-slate-600">Gestiona tu estado de seguimiento en tiempo real</p>
            </div>

            {/* Estado Actual */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isTracking ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                        <FiNavigation 
                            size={24} 
                            className={isTracking ? 'text-green-600' : 'text-gray-400'} 
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Estado del Tracking
                        </h2>
                        <p className={`text-sm font-medium ${
                            isTracking ? 'text-green-600' : 'text-gray-500'
                        }`}>
                            {isTracking ? 'Activo' : 'Inactivo'}
                        </p>
                    </div>
                </div>

                {isTracking && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FiCheckCircle size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                                Tracking en curso
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-700">
                            <FiClock size={14} />
                            <span>Tiempo activo: {formatTrackingTime()}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Información del Conductor */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                    Información del Conductor
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <FiTruck size={16} className="text-slate-500" />
                        <span className="text-sm text-slate-600">ID del Conductor:</span>
                        <span className="text-sm font-medium text-slate-900">#{driverId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FiMapPin size={16} className="text-slate-500" />
                        <span className="text-sm text-slate-600">Ubicación:</span>
                        <span className="text-sm font-medium text-slate-900">
                            {isTracking ? 'Compartiendo ubicación' : 'No disponible'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                    Controles de Seguimiento
                </h3>
                
                <div className="space-y-4">
                    <Button
                        onClick={handleToggleTracking}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-3 py-3 text-base font-medium ${
                            isTracking 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Procesando...</span>
                            </>
                        ) : isTracking ? (
                            <>
                                <FiPause size={20} />
                                <span>Detener Tracking</span>
                            </>
                        ) : (
                            <>
                                <FiPlay size={20} />
                                <span>Iniciar Tracking</span>
                            </>
                        )}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-slate-600">
                            {isTracking 
                                ? 'Tu ubicación se está compartiendo con el sistema de seguimiento'
                                : 'Inicia el tracking para compartir tu ubicación en tiempo real'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <FiNavigation size={16} className="text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                            Acerca del Tracking
                        </h4>
                        <p className="text-sm text-blue-700">
                            El sistema de tracking permite a los clientes y al centro de control 
                            conocer tu ubicación en tiempo real durante las entregas. 
                            Puedes activarlo y desactivarlo según sea necesario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
