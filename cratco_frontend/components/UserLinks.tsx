'use client';

import {useEffect, useRef, useState} from 'react';
import Link from "next/link";
import {useSearchParams} from 'next/navigation';
import {ILink} from "@/types/ILink";
import {ArrowRight, Copy, Trash} from "@deemlol/next-icons";
import DeleteLinkModal from "@/components/DeleteLinkModal";
import {LinkVisitsChart} from "@/components/charts/LinkVisitsChart";
import {getLinks} from "@/lib/links/actions";
export function UserLinks() {
    const [links, setLinks] = useState<ILink[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [linkToDelete, setLinkToDelete] = useState<{ id: string; name: string } | null>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const searchParams = useSearchParams();

    const openModal = (linkId: string, linkName: string) => {
        setLinkToDelete({ id: linkId, name: linkName });
        modalRef.current?.showModal();
    };

    const closeModal = () => {
        modalRef.current?.close();
        setLinkToDelete(null);
    };

    const fetchLinks = async () => {
        try {
            const data = await getLinks();
            setLinks(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
        const deleted = searchParams.get('deleted');
        const linkName = searchParams.get('name');

        if (deleted === 'true') {
            setAlert({
                type: 'success',
                message: `"${linkName}" has been successfully deleted!`
            });
            fetchLinks();
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            setTimeout(() => {
                setAlert(null);
            }, 4000);
        }
    }, [searchParams]);

    if (error) {
        throw error;
    }

    return (
        <div className="flex justify-center my-8">
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
                        <ul className="list text-center flex items-center gap-4">
                            {links.some(link => (link.visits || 0) > 0) &&
                                <LinkVisitsChart data={links.filter(link => (link.visits || 0) > 0)}/>}
                            <li className="text-xl uppercase font-semibold text-white opacity-80 tracking-wid">My
                                links:
                            </li>
                            {links?.map((link) => (
                                <li className="list-row bg-base-100 rounded-box shadow-md w-4/5 lg:w-auto lg:p-4" key={link._id}>
                                    <div>
                                        <Link href={`/my-links/${link._id}`}>
                                            <div className="list-col-grow mb-1">
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