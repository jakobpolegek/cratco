"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {ILink} from "@/types/ILink";
import {notFound} from 'next/navigation';

const API_SRC = process.env.NEXT_PUBLIC_API_SRC;

export async function getLinks(): Promise<ILink[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('getLinks: No token found, user is not authenticated.');
    }

    try {
        const res = await fetch(`${API_SRC}/links`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error('Failed to fetch links. Status:', res.status);
            return [];
        }

        const { data } = await res.json();
        return data || [];

    } catch (error) {
        console.error('An error occurred while fetching links:', error);
        return [];
    }
}

export async function getLink(linkId: string, ignoreNotFound = false): Promise<ILink | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('getLink: No token found, user is not authenticated.');
    }

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
            return null;
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
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return { success: false, error: 'Unauthorized.' };
    }

    if (!formData.originalAddress.trim()) {
        return { success: false, error: 'Original link is required!' };
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
            return { success: false, error: errorData.message || 'API request failed.' };
        }

        revalidatePath('/my-links');
        if (isEditMode) {
            revalidatePath(`/my-links/${formData._id}`);
        }

        return { success: true };

    } catch (error) {
        console.error("Link action failed:", error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function deleteLink(
    linkId: string,
): Promise<{ success: boolean; error?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return { success: false, error: 'Unauthorized. Please log in again.' };
    }

    try {
        const response = await fetch(`${API_SRC}/links/${linkId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to delete link.' };
        }
    } catch {
        return { success: false, error: 'An unexpected error occurred.' };
    }
    revalidatePath('/my-links');

    return { success: true };
}

