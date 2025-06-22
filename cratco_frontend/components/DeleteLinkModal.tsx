'use client';

import {useState, useTransition, forwardRef} from 'react';
import { IDeleteLinkModalProps } from "@/types/IDeleteLinkModalProps";
import { deleteLink } from '@/lib/links/actions';
import { useRouter } from "next/navigation";

const DeleteLinkModal = forwardRef<HTMLDialogElement, IDeleteLinkModalProps>(
    ({ onClose, linkId, linkName, shouldRedirect = false }, ref) => {
        const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
        const [isPending, startTransition] = useTransition();
        const router = useRouter();

        const handleClose = () => {
            setAlert(null);
            onClose();
        };

        const handleConfirmDelete = () => {
            startTransition(async () => {
                setAlert(null);

                const result = await deleteLink(linkId);

                if (result.success) {
                    if (shouldRedirect) {
                        router.replace('/my-links?deleted=true&name=' + encodeURIComponent(linkName || 'Link'));
                    } else {
                        const message = 'Link successfully deleted! This window will automatically close.';
                        setAlert({ type: 'success', message });
                        setTimeout(() => {
                            handleClose();
                        }, 2000);
                    }
                } else {
                    setAlert({ type: 'error', message: result.error || 'Failed to delete link.' });
                }
            });
        };

        return (
            <dialog ref={ref} className="modal">
                <div className="modal-box w-11/12 max-w-md flex flex-col justify-center items-center">
                    <h3 className="font-bold text-lg mb-4">Delete Link</h3>

                    {alert && (
                        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 w-full`}>
                            <span>{alert.message}</span>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <p className="text-base mb-2">Are you sure you want to delete this link?</p>
                        {linkName && (
                            <p className="text-sm opacity-70 font-medium">&quot;{linkName}&quot;</p>
                        )}
                        <p className="text-xs opacity-50 mt-2">This action cannot be undone.</p>
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn btn-outline"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            No, Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={handleConfirmDelete}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <><span className="loading loading-spinner loading-sm"></span> Deleting...</>
                            ) : (
                                'Yes, Delete'
                            )}
                        </button>
                    </div>
                </div>
            </dialog>
        );
    });

DeleteLinkModal.displayName = 'DeleteLinkModal';

export default DeleteLinkModal;