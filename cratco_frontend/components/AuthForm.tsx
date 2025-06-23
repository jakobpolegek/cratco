'use client';

import { useActionState } from 'react';
import { signIn, signUp } from '@/lib/auth/actions';
import { IAuthFormProps } from "@/types/IAuthFormProps";
import { SubmitButton } from "@/components/SubmitButton";

export function AuthForm({ mode }: IAuthFormProps) {
    const action = mode === 'login' ? signIn : signUp;

    const [state, formAction] = useActionState(action, undefined);

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-darken rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>

            <form action={formAction} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-500">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        name="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {state?.error && (
                    <div className="text-red-600 text-sm">{state.error}</div>
                )}

                <SubmitButton mode={mode} />
            </form>
        </div>
    );
}
