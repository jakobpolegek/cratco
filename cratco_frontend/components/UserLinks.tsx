'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useApi } from "@/hooks/useApi";

export function UserLinks() {
    const {apiCall} = useApi();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const data = await apiCall('/links');
                setLinks(data);
            } catch (error) {
                console.error('Failed to fetch links:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            {links?.length === 0 ? (
                <div>No links yet.</div>
            ) : (
                <div>
                    <h2>My links:</h2>
                    <ul className="mt-8">
                        {links?.map((link: { _id: string, name: string }) => (
                            <li key={link._id}>
                                <Link href={`/my-links/${link._id}`}>
                                    <h3>{link.name}</h3>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}