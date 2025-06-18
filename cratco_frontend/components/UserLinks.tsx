'use client';

import {useEffect, useRef, useState, useCallback} from 'react';
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import {iLink} from "@/types/iLink";
import {ArrowRight, Copy, Trash} from "@deemlol/next-icons";
import DeleteLinkModal from "@/components/DeleteLinkModal";

export function UserLinks() {
    const {apiCall} = useApi();
    const [links, setLinks] = useState<iLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [linkToDelete, setLinkToDelete] = useState<{ id: string; name: string } | null>(null);
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = (linkId: string, linkName: string) => {
        setLinkToDelete({ id: linkId, name: linkName });
        modalRef.current?.showModal();
    };

    const closeModal = () => {
        modalRef.current?.close();
        setAlert(null);
        setLinkToDelete(null);
        fetchLinks();
    };

    const fetchLinks = useCallback(async () => {
        try {
            const res = await apiCall('/links');
            const { data } = await res.json();
            setLinks(data);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        } finally {
            setLoading(false);
        }
    }, [apiCall]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    return (
        <div className="flex justify-center mt-8">
            {alert && (
                <div
                    className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} p-4 w-auto fixed top-4 right-4 z-50 max-w-md`}>
                    <span>{alert.message}</span>
                </div>
            )}

            {loading ? (
                <span className="loading loading-infinity loading-xl"></span>
            ) : (
                <div>
                    {links?.length === 0 ? <div>No links yet.</div> :
                        <ul className="list text-center">
                            <li className="text-xl opacity-60 tracking-wide">My links:</li>
                            {links?.map((link) => (
                                <li className="list-row bg-base-100 rounded-box shadow-md mt-2 px-4 py-2" key={link._id}>
                                    <div>
                                        <Link href={`/my-links/${link._id}`}>
                                            <div className="list-col-grow">
                                                <div className="text-2xl uppercase font-semibold">{link.name}</div>
                                                <div className="text-xl opacity-60">
                                                    {link.customAddress}
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="text-xl opacity-60">
                                            <button className="btn btn-sm btn-secondary"
                                                    onClick={() => openModal(link._id, link.name)}
                                            >
                                                <Trash size={20} color="#FFFFFF"/>
                                            </button>
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
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>}

                    <DeleteLinkModal
                        ref={modalRef}
                        onClose={closeModal}
                        linkId={linkToDelete?.id || ''}
                        linkName={linkToDelete?.name || ''}
                    />
                </div>
            )}
        </div>
    );
}