"use server";

import {IAuthResponse} from "@/types/IAuthResponse";
import {ActionState} from "@/types/ActionState";

export async function signUp(
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

        const data:  IAuthResponse = await response.json();

        if (!response.ok) {
            throw new Error(`An error occured trying to fetch links: ${data.message || 'Invalid response from server.'}`);
        }

        return { success: true };

    } catch(error)  {
        throw new Error(`Sign up failed: ${error instanceof Error || 'An unexpected network error occurred.' }`);
    }

}
