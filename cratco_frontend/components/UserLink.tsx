'use client';

import { useEffect, useState } from 'react';
import { useApi } from "@/hooks/useApi";
import {iLink} from "@/types/iLink";
import {ArrowRight, Copy} from "@deemlol/next-icons";


export function UserLink({linkId}: { linkId: string }) {
    const {apiCall} = useApi();
    const [link, setLink] = useState<iLink>();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const res = await apiCall(`/links/${linkId}`);
                const { data } = await res.json();
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
            {alert && (
                <div
                    className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} p-4 w-auto fixed top-4 right-4 z-50 max-w-md`}>
                    <span>{alert.message}</span>
                </div>
            )}
            {loading? (
                <span className="loading loading-infinity loading-xl"></span>
            ) : (<>
                {link && (<div>
                    <p className="mt-2"><span className="text-xl font-bold">Name: </span>{link?.name}</p>
                    <p className="mt-2 flex items-center gap-2">
                        <span className="text-xl font-bold">Custom address: </span>
                        /{link?.customAddress}
                        <button className="btn btn-sm"
                                onClick={() => {
                                    setAlert({ type: 'success', message: 'Link copied to clipboard!' });
                                    setTimeout(() => {
                                        setAlert(null);
                                    }, 4000);
                                    navigator.clipboard.writeText(`${window.location.origin}/${link?.customAddress}`);
                                }}>
                            <Copy size={20} color="#FFFFFF"/>
                        </button>
                        <a href={`/${link?.customAddress}`} target="_blank"
                           className="btn btn-sm">
                            <ArrowRight size={20} color="#FFFFFF"/>
                        </a>
                    </p>
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