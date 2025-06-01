'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {ProtectedRouteProps} from "@/types/ProtectedRouteProps";

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}