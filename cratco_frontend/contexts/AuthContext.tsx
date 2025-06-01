'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/lib/AuthService';
import { User } from '@/types/Auth';
import { AuthContextType } from '@/types/AuthContextType';
import Cookies from "js-cookie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedToken = AuthService.getToken();
            const storedUser = Cookies.get('user');

            if (storedToken && !AuthService.isTokenExpired(storedToken) && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } else {
                AuthService.signOut();
                Cookies.remove('user');
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await AuthService.signIn(email, password);
            setToken(response.data.token);
            setUser(response.data.user);
            const {_id, name, email: userEmail, createdAt, updatedAt} = response.data.user;
            Cookies.set('user', JSON.stringify({_id, name, email: userEmail, createdAt, updatedAt}), {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const response = await AuthService.signUp(name, email, password);
            setToken(response.data.token);
            setUser(response.data.user);
            const {_id, email: userEmail, createdAt, updatedAt} = response.data.user;
            Cookies.set('user', JSON.stringify({_id, name, email: userEmail, createdAt, updatedAt}), {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        AuthService.signOut();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
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