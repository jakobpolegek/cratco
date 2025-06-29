'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import CreateEditLinkModal from '@/components/CreateEditLinkModal';
export const dynamic = 'force-dynamic';

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

  return (
    <div className="flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-8rem)]">
      {loading ? (
        <div className="w-full max-w-md">
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-50">
            Welcome to crat.co
          </h1>

          <div className="py-8 px-4 sm:rounded-lg sm:px-10">
            <button
              className="btn btn-active btn-primary flex mx-auto"
              onClick={openModal}
            >
              Create new link here
            </button>

            <CreateEditLinkModal
              ref={modalRef}
              onClose={closeModal}
              mode="create"
            />
          </div>
        </div>
      )}
    </div>
  );
}
