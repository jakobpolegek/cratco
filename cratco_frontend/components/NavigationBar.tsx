'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const NavigationBar = () => {
  const { user } = useAuth();
  return (
    <div
      id="navigation-bar"
      className="bg-custom-grey fixed top-0 left-0 right-0 z-2 flex gap-6 py-4 items-center justify-center"
    >
      {' '}
      {user && (
        <>
          <Link href="/">Home</Link>
          <Link href="/my-links" className="text-2xl mb-1 font-extrabold">
            {user.name}
          </Link>
          <Link href="/about">About</Link>
        </>
      )}
    </div>
  );
};
