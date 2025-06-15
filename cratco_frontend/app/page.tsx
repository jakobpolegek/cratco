'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import CreateLinkForm from '@/components/CreateLinkForm';

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        modalRef.current?.showModal();
    };

    const closeModal = () => {
        modalRef.current?.close();
    };

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center mt-8">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blend-darken flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-50">
                    Welcome to crat.co
                </h1>

                <div className="bg-blend-darken py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <button
                        className="btn btn-active btn-primary flex mx-auto"
                        onClick={openModal}
                    >
                        Create new link here
                    </button>

                    <CreateLinkForm
                        ref={modalRef}
                        onClose={closeModal}
                    />
                </div>
            </div>
        </div>
    );
}