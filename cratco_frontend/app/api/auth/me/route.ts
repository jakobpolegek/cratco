import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.customToken) {
        throw new Error(`Unauthorized.`);
    }

    const token = session.customToken;

    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_SRC;

        const apiResponse = await fetch(`${apiBaseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            return NextResponse.json({ error: errorData.message || 'Session invalid' }, { status: apiResponse.status });
        }

        const fetchedUser = await apiResponse.json();
        return NextResponse.json({ user: fetchedUser.data });
    } catch (error) {
        console.error('API call to /users/me failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
