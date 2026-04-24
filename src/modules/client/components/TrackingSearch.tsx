"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shared/ui/Button";
import { Input } from "@/modules/shared/ui/Input";
import { ROUTES } from "@/modules/shared/constants/routes";
import { FiPackage, FiSearch } from "react-icons/fi";

export function TrackingSearch() {
    const router = useRouter();
    const [numPackage, setNumPackage] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!numPackage.trim()) return;

        setIsSearching(true);

        // Simulate search delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Navigate to tracking page
        router.push(ROUTES.client.trackPackage(numPackage.trim()));
        setIsSearching(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiPackage size={32} className="text-blue-600" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Ingresa tu número de paquete
                        </h2>

                        {/* Description */}
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Revisa el estado de tu paquete y su ubicación en tiempo real
                        </p>

                        {/* Search Input */}
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Ingresa el número de paquete"
                                    value={numPackage}
                                    onChange={(e) => setNumPackage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full text-center text-lg py-4 px-6 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    disabled={isSearching}
                                />
                            </div>

                            <Button
                                onClick={handleSearch}
                                disabled={!numPackage.trim() || isSearching}
                                className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all rounded-xl"
                            >
                                {isSearching ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Buscando...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <FiSearch size={20} />
                                        Buscar
                                    </div>
                                )}
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-500">
                                El número de paquete se encuentra en tu confirmación de envío
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
