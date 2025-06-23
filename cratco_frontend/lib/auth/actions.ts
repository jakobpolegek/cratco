"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { IAuthResponse } from "@/types/IAuthResponse";
import {ActionState} from "@/types/ActionState";

export async function signIn(
    prevState: ActionState | undefined,
    formData: FormData
): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SRC}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data: IAuthResponse = await response.json();

        if (!response.ok) {
            return { error: data.message || 'Sign in failed.' };
        }

        const cookieStore = await cookies();
        cookieStore.set('token', data.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

    } catch {
        return { error: 'An unexpected network error occurred.' };
    }

    redirect('/');
}

export async function signUp(
    prevState: ActionState | undefined,
    formData: FormData
): Promise<ActionState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SRC}/auth/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data: IAuthResponse = await response.json();

        if (!response.ok) {
            return { error: data.message || 'Sign up failed.' };
        }

        const cookieStore = await cookies();
        cookieStore.set('token', data.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

    } catch  {
        return { error: 'An unexpected network error occurred.' };
    }

    redirect('/');
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete('token');

    redirect('/login');
}
