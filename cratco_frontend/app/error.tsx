"use client";

import Link from "next/link";
import {AlertTriangle, House, RefreshCw} from "@deemlol/next-icons";
import {IErrorBoundaryProps} from "@/types/IErrorBoundaryProps";

export default function ErrorBoundary({error, reset}: IErrorBoundaryProps) {
    return (
        <div className="min-h-screen from-error/10 via-base-100 to-warning/10 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <AlertTriangle size={64} className="text-error mx-auto mb-8"/>
                <div className="card bg-base-100 shadow-2xl border border-error/20">
                    <div className="card-body text-center">
                        <h1 className="card-title text-4xl font-bold text-error justify-center mb-4">
                            Oops! Something went wrong
                        </h1>

                        <div className="collapse collapse-arrow bg-base-200 mb-6">
                            <input type="checkbox"/>
                            <div className="collapse-title text-sm font-medium text-base-content/60">
                                View technical details
                            </div>
                            <div className="collapse-content">
                                <code
                                    className="block bg-base-300 p-4 rounded-lg text-sm text-error break-all text-left">
                                    {error.message || "An unexpected error occurred."}
                                </code>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={reset} className="btn btn-primary btn-wide gap-2 group">
                                <RefreshCw
                                    className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"/>
                                Try Again
                            </button>
                            <Link href="/" className="btn btn-outline btn-wide gap-2 group">
                                <House className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"/>
                                Go Home
                            </Link>
                        </div>

                        <div className="divider my-6"/>

                        <p className="text-base-content/50 text-sm mb-4">
                            If this problem persists, please feel free to contact support.
                        </p>
                        {error.digest && (
                            <span className="text-xs text-base-content/40">
                                Error Digest: {error.digest}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}