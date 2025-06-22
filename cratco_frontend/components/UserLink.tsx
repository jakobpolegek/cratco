'use client';

import { useRef, useState } from 'react';
import type { ILink } from "@/types/ILink";
import { ArrowRight, Copy, Trash, Edit } from "@deemlol/next-icons";
import DeleteLinkModal from "@/components/DeleteLinkModal";
import CreateEditLinkModal from "@/components/CreateEditLinkModal";

export function UserLink({ link }: { link: ILink }) {
    const deleteModalRef = useRef<HTMLDialogElement>(null);
    const editModalRef = useRef<HTMLDialogElement>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const openDeleteModal = () => {
        deleteModalRef.current?.showModal();
    };

    const openEditModal = () => {
        editModalRef.current?.showModal();
    };

    const closeModal = () => {
        deleteModalRef.current?.close();
        editModalRef.current?.close();
    };

    return (
        <div className="flex justify-center mt-8">
            {alert && (
                <div
                    className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} p-4 w-auto fixed top-4 right-4 z-50 max-w-md`}>
                    <span>{alert.message}</span>
                </div>
            )}

            <div>
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
                <p className="mt-2"><span className="text-xl font-bold">Visits: </span>{link?.visits}</p>
                <p className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-bold">Active till: </span>
                    {new Date(link?.renewalDate).toLocaleDateString()}
                </p>
                <p id="buttons" className="mt-2 flex items-center gap-2">
                    <button className="btn btn-sm btn-secondary" onClick={openDeleteModal}>
                        <Trash size={20} color="#FFFFFF"/> Delete
                    </button>
                    <button className="btn btn-sm" onClick={openEditModal}>
                        <Edit size={20} color="#FFFFFF"/> Edit
                    </button>
                </p>
            </div>

            <DeleteLinkModal
                ref={deleteModalRef}
                onClose={closeModal}
                linkId={link._id}
                linkName={link.name}
                shouldRedirect={true}
            />
            <CreateEditLinkModal
                ref={editModalRef}
                onClose={closeModal}
                mode="edit"
                editLink={link}
            />
        </div>
    );
}