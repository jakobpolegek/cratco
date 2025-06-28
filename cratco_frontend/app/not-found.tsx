"use client";

import Link from "next/link";
import {AlertTriangle, House} from "@deemlol/next-icons";

export default function NotFound() {
    return (
        <div className="min-h-screen from-error/10 via-base-100 to-warning/10 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="card bg-base-100 shadow-2xl border border-error/20">
                    <div className="card-body text-center">
                        <AlertTriangle size={64} className="text-error mx-auto mb-8"/>
                        <h1 className="card-title text-4xl font-bold text-error justify-center mb-4">
                            Not found!
                        </h1>
                        <Link href="/" className="btn btn-outline btn-wide gap-2 group mx-auto">
                            <House className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"/>
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}