'use client';

import { useState, forwardRef, useEffect } from 'react';
import { useApi } from "@/hooks/useApi";
import { iLink } from "@/types/iLink";

interface CreateEditLinkModalProps {
    onClose: () => void;
    editLink?: iLink | null;
    mode?: 'create' | 'edit';
}

const CreateEditLinkModal = forwardRef<HTMLDialogElement, CreateEditLinkModalProps>(({ onClose, editLink = null, mode = 'create' }, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        originalAddress: '',
        customAddress: ''
    });
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { apiCall } = useApi();

    useEffect(() => {
        if (mode === 'edit' && editLink) {
            setFormData({
                name: editLink.name || '',
                originalAddress: editLink.originalAddress || '',
                customAddress: editLink.customAddress || ''
            });
        } else {
            setFormData({
                name: '',
                originalAddress: '',
                customAddress: ''
            });
        }
        setAlert(null);
    }, [mode, editLink]);

    const clearForm = () => {
        setFormData({
            name: '',
            originalAddress: '',
            customAddress: ''
        });
        setAlert(null);
    };

    const handleClose = () => {
        clearForm();
        onClose();
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const submitForm = async () => {
        try {
            if (!formData.originalAddress.trim()) {
                setAlert({ type: 'error', message: 'Original link is required!' });
                return;
            }

            if (!URL.canParse(formData.originalAddress)) {
                setAlert({ type: 'error', message: 'Please enter a valid URL.' });
                return;
            }

            setIsSubmitting(true);
            setAlert(null);

            const body = JSON.stringify({
                name: formData.name,
                originalAddress: formData.originalAddress,
                customAddress: formData.customAddress,
                ...(mode === 'create' && { startDate: new Date() })
            });

            let res;
            if (mode === 'edit' && editLink) {
                res = await apiCall(`/links/${editLink._id}`, {
                    method: 'PUT',
                    body
                });
            } else {
                res = await apiCall('/links', {
                    method: 'POST',
                    body
                });
            }
            const successMessage = mode === 'edit' ? 'Link successfully updated!' : 'Link successfully created!';

            if ((mode === 'create' && res.status===201) || (mode === 'edit' && res)) {
                setAlert({ type: 'success', message: `${successMessage} This window will close in 3 seconds.` });
                setTimeout(() => {
                    clearForm();
                    setIsSubmitting(false);
                    onClose();
                }, 3000);
            } else {
                const errorMessage = mode === 'edit' ? 'Failed to update link.' : 'Failed to create link.';
                setAlert({ type: 'error', message: `${errorMessage} Please try again.` });
                setIsSubmitting(false);
            }
        } catch {
            const errorMessage = mode === 'edit' ? 'Failed to update link.' : 'An error occurred while creating the link.';
            setAlert({type: 'error', message: `${errorMessage} Please try again.`});
            setIsSubmitting(false);
        }
    };

    const modalTitle = mode === 'edit' ? 'Edit Link' : 'Create New Link';
    const submitButtonText = mode === 'edit' ? 'Update' : 'Create';
    const loadingText = mode === 'edit' ? 'Updating...' : 'Creating...';

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box w-11/12 max-w-xl flex flex-col justify-center items-center">
                <h3 className="font-bold text-lg mb-4">{modalTitle}</h3>

                {alert && (
                    <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 w-full`}>
                        <span>{alert.message}</span>
                    </div>
                )}

                <div className="flex flex-col items-center w-full">
                    {mode==='edit' && <label htmlFor="name" className="text-sm font-medium text-gray-500 mb-1">Link name:</label>}
                    <input
                    type="text"
                    placeholder="Name of your link"
                    className="input input-primary w-full mb-4"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={isSubmitting}
                    />
                    {mode==='edit' && <label htmlFor="originalAddress" className="text-sm font-medium text-gray-500 mb-1">Original address:</label>}
                    <input
                        type="text"
                        placeholder="Original link"
                        className="input input-primary w-full mb-4"
                        value={formData.originalAddress}
                        onChange={(e) => handleInputChange('originalAddress', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {mode==='edit' && <label htmlFor="originalAddress" className="text-sm font-medium text-gray-500 mb-1">Custom address:</label>}
                    <input
                        type="text"
                        placeholder="Custom address"
                        className="input input-primary w-full"
                        value={formData.customAddress}
                        onChange={(e) => handleInputChange('customAddress', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {mode==='create' && <p className="py-4 text-center text-sm opacity-70">
                        Your links can be viewed by clicking on your name in the navigation bar.
                    </p>}
                </div>

                <div className="modal-action">
                    <button
                        className="btn btn-secondary mr-4"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={submitForm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                {loadingText}
                            </>
                        ) : (
                            submitButtonText
                        )}
                    </button>
                </div>
            </div>
        </dialog>
    );
});

CreateEditLinkModal.displayName = 'CreateEditLinkModal';

export default CreateEditLinkModal;