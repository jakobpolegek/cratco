"use server";

import { revalidatePath } from 'next/cache';
import {ILink} from "@/types/ILink";
import {notFound} from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth/authOptions';

const API_SRC = process.env.NEXT_PUBLIC_API_SRC;

export async function getLinks(): Promise<ILink[]> {
    const session = await getServerSession(authOptions);

    if (!session?.customToken) {
        throw new Error(`Unauthorized.`);
    }

    const token = session.customToken;

    try {
        const res = await fetch(`${API_SRC}/links`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch links. Status: '+ res.status);
        }

        const { data } = await res.json();
        return data || [];

    } catch (error) {
        throw new Error(`An error occured trying to fetch links: ${error}`);
    }
}

export async function getLink(linkId: string, ignoreNotFound = false): Promise<ILink> {
    const session = await getServerSession(authOptions);
    if (!session?.customToken) {
        throw new Error(`Unauthorized.`);
    }

    const token = session.customToken;

    try {
        const res = await fetch(`${API_SRC}/links/${linkId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (res.status === 404) {
            if (!ignoreNotFound) {
                notFound();
            }
            throw new Error(`Link not found. Status: ${res.status}`);
        }

        if (!res.ok) {
            throw new Error(`Failed to fetch link. Status: ${res.status}`);
        }

        const { data } = await res.json();
        return data || null;

    } catch (error) {
        throw new Error(`An error occured trying to fetch link: ${error}`);
    }
}

export async function createOrUpdateLink(
    formData: ILinkFormData
): Promise<{ success: boolean; error?: string }> {
    const session = await getServerSession(authOptions);

    if (!session?.customToken) {
        throw new Error(`Unauthorized.`);
    }

    const token = session.customToken;

    if (!token) {
        throw new Error(`Token is missing.`);
    }

    if (!formData.originalAddress.trim()) {
        throw new Error(`Original link is required.`);
    }

    try {
        const isEditMode = formData.mode === 'edit' && formData._id;
        const endpoint = isEditMode ? `${API_SRC}/links/${formData._id}` : `${API_SRC}/links/`;
        const method = isEditMode ? 'PUT' : 'POST';

        let bodyPayload;

        if (isEditMode) {
            const { ...payload } = formData;
            bodyPayload = payload;
        } else {
            bodyPayload = {
                name: formData.name,
                originalAddress: formData.originalAddress,
                customAddress: formData.customAddress,
                startDate: new Date(),
            };
        }

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bodyPayload),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }

        revalidatePath('/my-links');
        if (isEditMode) {
            revalidatePath(`/my-links/${formData._id}`);
        }

        return { success: true };

    } catch (error) {
        throw new Error(`An error occured trying to create or update link: ${error}`);
    }
}


export async function deleteLink(
    linkId: string,
): Promise<{ success: boolean; error?: string }> {
    const session = await getServerSession(authOptions);

    if (!session?.customToken) {
        throw new Error(`Unauthorized.`);
    }

    const token = session.customToken;

    try {
        const response = await fetch(`${API_SRC}/links/${linkId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete link: ${errorData.message}`);
        }
    } catch (error) {
        throw new Error(`An error occured trying to delete link: ${error}`);
    }
    revalidatePath('/my-links');

    return { success: true };
}

