import {AuthResponse} from "@/types/AuthResponse";
import Cookies from 'js-cookie';

const API_SRC = process.env.NEXT_PUBLIC_API_SRC;

export class AuthService {
    private static getStoredToken(): string | null {
        if (typeof window === 'undefined') return null;
        return Cookies.get('token') || null;
    }

    private static setStoredToken(token: string): void {
        if (typeof window === 'undefined') return;
        Cookies.set('token', token, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }

    static removeStoredToken(): void {
        if (typeof window === 'undefined') return;
        Cookies.remove('token');
    }

    static async signUp(name: string, email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_SRC}/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Sign up failed');
        }

        this.setStoredToken(data.data.token);
        return data;
    }

    static async signIn(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_SRC}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Sign in failed');
        }

        this.setStoredToken(data.data.token);
        return data;
    }

    static async signOut(): Promise<void> {
        const token = this.getStoredToken();

        if (token) {
            try {
                await fetch(`${API_SRC}/auth/sign-out`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Sign out API call failed:', error);
            }
        }

        this.removeStoredToken();
        Cookies.remove('user');
    }

    static getToken(): string | null {
        return this.getStoredToken();
    }

    static isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
}