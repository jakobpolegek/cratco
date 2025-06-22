'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth/actions';
import { User } from '@/types/Auth';
import { AuthContextType } from '@/types/AuthContextType';

const AuthContext = createContext<Omit<AuthContextType, 'login' | 'register' | 'token'> | undefined>(undefined);

const publicPaths = ['/login', '/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const fetchUser = useCallback(async () => {
        if (publicPaths.some(path => pathname.startsWith(path))) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [pathname]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = async () => {
        setUser(null);
        await signOut();
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
