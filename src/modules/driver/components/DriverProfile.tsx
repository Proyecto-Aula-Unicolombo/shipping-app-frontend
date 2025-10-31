"use client";

import { 
    FiPhone, 
    FiMail, 
    FiMapPin, 
    FiTruck,
    FiUser
} from "react-icons/fi";

export function DriverProfile() {
    // Mock data - in real app this would come from API/context
    const driverInfo = {
        name: "Ricardo Mendoza",
        id: "987654",
        phone: "+52 55 1234 5678",
        email: "ricardo.mendoza@example.com",
        address: "Calle Principal 123, Ciudad de México",
        vehicle: {
            model: "Nissan Versa, Blanco",
            plate: "ABC-123-DEF"
        },
        avatar: null // Could be an image URL
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Content */}
                <div className="p-4 space-y-6 -mt-16 pt-16">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl p-6 text-center">
                        <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            {driverInfo.avatar ? (
                                <img 
                                    src={driverInfo.avatar} 
                                    alt={driverInfo.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <FiUser size={32} className="text-orange-600" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                            {driverInfo.name}
                        </h2>
                        <p className="text-slate-600">
                            ID de Conductor: {driverInfo.id}
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Información de Contacto
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <FiPhone size={18} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Teléfono</p>
                                    <p className="text-sm text-slate-600">{driverInfo.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <FiMail size={18} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Correo Electrónico</p>
                                    <p className="text-sm text-slate-600">{driverInfo.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <FiMapPin size={18} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Dirección</p>
                                    <p className="text-sm text-slate-600">{driverInfo.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="bg-white rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Vehículo Asignado
                        </h3>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiTruck size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Modelo</p>
                                <p className="text-sm text-slate-600">{driverInfo.vehicle.model}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                <div className="max-w-4xl mx-auto p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Perfil</h1>
                        <p className="text-slate-600">Información personal y del vehículo</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-8 text-center sticky top-8">
                                <div className="w-32 h-32 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {driverInfo.avatar ? (
                                        <img 
                                            src={driverInfo.avatar} 
                                            alt={driverInfo.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <FiUser size={48} className="text-orange-600" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {driverInfo.name}
                                </h2>
                                <p className="text-slate-600 mb-4">
                                    ID de Conductor: {driverInfo.id}
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <FiTruck size={14} />
                                    Conductor
                                </div>
                            </div>
                        </div>

                        {/* Information Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl p-8">
                                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                                    Información de Contacto
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <FiPhone size={20} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Teléfono</p>
                                            <p className="text-slate-600">{driverInfo.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <FiMail size={20} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Correo Electrónico</p>
                                            <p className="text-slate-600">{driverInfo.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <FiMapPin size={20} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Dirección</p>
                                            <p className="text-slate-600">{driverInfo.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div className="bg-white rounded-xl p-8">
                                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                                    Vehículo Asignado
                                </h3>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FiTruck size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Modelo</p>
                                        <p className="text-slate-600">{driverInfo.vehicle.model}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
