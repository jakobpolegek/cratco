'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { signOut } from 'next-auth/react';
import { AlertTriangle, House, RefreshCw } from '@deemlol/next-icons';
import { IErrorBoundaryProps } from '@/types/IErrorBoundaryProps';

export default function ErrorBoundary({ error, reset }: IErrorBoundaryProps) {
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const isAuthError = useMemo(() => {
    if (!error) return false;
    if (error.message?.includes('401') || error.message?.includes('500'))
      return true;
    if (
      error instanceof Response &&
      (error.status === 401 || error.status === 500)
    )
      return true;

    const authErrorPatterns = [
      'unauthorized',
      'authentication',
      'session expired',
      'invalid token',
      'access denied',
    ];

    return authErrorPatterns.some((pattern) =>
      error.message?.toLowerCase().includes(pattern)
    );
  }, [error]);

  useEffect(() => {
    if (isAuthError) {
      setAuthMessage('Session inactive or expired, you will be signed off...');
      setCountdown(6);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            signOut({ callbackUrl: '/login' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isAuthError]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="max-w-2xl w-full">
        {authMessage ? (
          <div className="card bg-base-100 shadow-xl text-center">
            <div className="card-body items-center">
              <AlertTriangle size={48} className="text-warning mb-4" />
              <h2 className="card-title">Authentication Issue</h2>
              <p>{authMessage}</p>
              {countdown > 0 && (
                <p className="text-sm text-base-content/60 mt-2">
                  Redirecting in {countdown} seconds...
                </p>
              )}
              <div className="card-actions justify-center mt-4">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="btn btn-primary btn-sm"
                >
                  Sign Out Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <AlertTriangle size={64} className="text-error mx-auto mb-8" />
            <div className="card bg-base-100 shadow-2xl border border-error/20">
              <div className="card-body text-center">
                <h1 className="card-title text-4xl font-bold text-error justify-center mb-4">
                  Oops! Something went wrong
                </h1>
                <div className="collapse collapse-arrow bg-base-200 mb-6">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium text-base-content/60">
                    View technical details
                  </div>
                  <div className="collapse-content">
                    <code className="block bg-base-300 p-4 rounded-lg text-sm text-error break-all text-left">
                      {error.message || 'An unexpected error occurred.'}
                    </code>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={reset}
                    className="btn btn-primary btn-wide gap-2 group"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                    Try Again
                  </button>
                  <Link
                    href="/"
                    className="btn btn-outline btn-wide gap-2 group"
                  >
                    <House className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
