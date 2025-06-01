'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blend-darken flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-50 mb-8">
                    Welcome to crat.co!
                </h1>
                {user ? (
                    <div className="bg-blend-darken py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h3>Create new link here!</h3>
                        <div className="space-y-4">
                            <Link
                                href="/my-links"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create!
                            </Link>
                        </div>
                    </div>
                    ) : (
                    <div className="bg-blend-darken py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="space-y-4">
                            <Link
                                href="/login"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}