"use client";

import Link from "next/link";
import { AlertTriangle, House, RefreshCw } from "@deemlol/next-icons";
import {IErrorBoundaryProps} from "@/types/IErrorBoundaryProps";

export default function ErrorBoundary({ error, reset }: IErrorBoundaryProps) {
    return (
        <div className="min-h-screen from-error/10 via-base-100 to-warning/10 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <AlertTriangle size={64} className="text-error" />
                    </div>
                </div>

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
                                <div className="bg-base-300 p-4 rounded-lg text-left">
                                    <code className="text-sm text-error break-all">
                                        {error.message || "An unexpected error occurred."}
                                    </code>
                                </div>
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

                            <Link href="/" className="btn btn-outline btn-wide gap-2 group">
                                <House className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                Go Home
                            </Link>
                        </div>

                        <div className="divider my-6"></div>

                        <div className="text-center">
                            <p className="text-base-content/50 text-sm mb-4">
                                If this problem persists, please feel free to contact support.
                            </p>
                            {error.digest && (
                                <div className="text-xs text-base-content/40">
                                    <span>Error Digest: {error.digest}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
