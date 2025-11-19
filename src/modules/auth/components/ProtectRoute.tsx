"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/login/store/authStore';
import { ROUTES } from '@/modules/shared/constants/routes';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'coord' | 'driver')[];
}

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm text-slate-600">Verificando autenticación...</p>
            </div>
        </div>
    );
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, user, token } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated || !token) {
                router.replace(ROUTES.auth.login);
                return;
            }

            if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                const redirectPath = user.role === 'driver' 
                    ? ROUTES.driver.orders 
                    : ROUTES.dashboard.panel;
                router.replace(redirectPath);
            }
        }
    }, [mounted, isAuthenticated, token, user, allowedRoles, router]);

    if (!mounted) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated || !token) {
        return <LoadingScreen />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}