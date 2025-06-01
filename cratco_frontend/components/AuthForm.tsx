'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {AuthFormProps} from "@/types/AuthFormProps";

export function AuthForm({ mode }: AuthFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            router.push('/'); // Redirect after successful auth
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-blend-darken rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-500">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                </button>
            </form>
        </div>
    );
}