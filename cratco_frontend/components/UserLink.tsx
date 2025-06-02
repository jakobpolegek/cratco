'use client';

import { useEffect, useState } from 'react';
import { useApi } from "@/hooks/useApi";
import {iLink} from "@/types/iLink";


export function UserLink({linkId}: { linkId: string }) {
    const {apiCall} = useApi();
    const [link, setLink] = useState<iLink>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const data = await apiCall(`/links/${linkId}`);
                setLink(data);
            } catch (error) {
                console.error('Failed to fetch links:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLink();
    }, []);

    return (
        <div className="flex justify-center mt-8">
            {loading? (
                <span className="loading loading-infinity loading-xl"></span>
            ) : (<>
                {link && (<div>
                    <p className="mt-2"><span className="text-xl font-bold">Name: </span>{link?.name}</p>
                    <p className="mt-2"><span
                        className="text-xl font-bold">Status: </span>{link?.status?.charAt(0).toUpperCase() + link?.status?.slice(1)}
                    </p>
                    <p className="mt-2"><span className="text-xl font-bold">Original address: </span>{link?.originalAddress}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Active till: </span>{new Date(link?.renewalDate).toLocaleDateString()}</p>
                </div>)}</>
            )}
        </div>
    );
}