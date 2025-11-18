"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/modules/shared/constants/routes';
import { useAuthStore } from '../login/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'coord' | 'driver')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(ROUTES.auth.login);
            return;
        }

        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Redirigir según el rol
            if (user.role === 'driver') {
                router.push(ROUTES.driver.orders);
            } else {
                router.push(ROUTES.dashboard.panel);
            }
        }
    }, [isAuthenticated, user, allowedRoles, router]);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}