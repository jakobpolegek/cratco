'use client';

import { useState, forwardRef } from 'react';
import { useApi } from "@/hooks/useApi";

interface CreateLinkFormProps {
    onClose: () => void;
}

const CreateLinkForm = forwardRef<HTMLDialogElement, CreateLinkFormProps>(({ onClose }, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        originalAddress: '',
        customAddress: ''
    });
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { apiCall } = useApi();

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

    const createLink = async () => {
        if (!formData.name.trim() || !formData.originalAddress.trim()) {
            setAlert({ type: 'error', message: 'Name and original link are required!' });
            return;
        }

        setIsSubmitting(true);
        setAlert(null);

        try {
            const body = JSON.stringify({
                name: formData.name,
                originalAddress: formData.originalAddress,
                customAddress: formData.customAddress,
                startDate: new Date()
            });

            const res = await apiCall('/links', {
                method: 'POST',
                body
            });

            if (res.createdAt) {
                setAlert({ type: 'success', message: 'Link successfully created! This window will close in 4 seconds.' });
                setTimeout(() => {
                    clearForm();
                    setIsSubmitting(false);
                    onClose();
                }, 4000);
            } else {
                setAlert({ type: 'error', message: 'Failed to create link. Please try again.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
        }
    };

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box w-11/12 max-w-xl flex flex-col justify-center items-center">
                <h3 className="font-bold text-lg mb-4">Create New Link</h3>

                {alert && (
                    <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 w-full`}>
                        <span>{alert.message}</span>
                    </div>
                )}

                <div className="flex flex-col gap-4 items-center w-full">
                    <input
                        type="text"
                        placeholder="Name of your link"
                        className="input input-primary w-full"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={isSubmitting}
                    />
                    <input
                        type="text"
                        placeholder="Original link"
                        className="input input-primary w-full"
                        value={formData.originalAddress}
                        onChange={(e) => handleInputChange('originalAddress', e.target.value)}
                        disabled={isSubmitting}
                    />
                    <input
                        type="text"
                        placeholder="Custom address"
                        className="input input-primary w-full"
                        value={formData.customAddress}
                        onChange={(e) => handleInputChange('customAddress', e.target.value)}
                        disabled={isSubmitting}
                    />
                    <p className="py-4 text-center text-sm opacity-70">
                        Your links can be viewed by clicking on your name in the navigation bar.
                    </p>
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
                        onClick={createLink}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Creating...
                            </>
                        ) : (
                            'Create'
                        )}
                    </button>
                </div>
            </div>
        </dialog>
    );
});

CreateLinkForm.displayName = 'CreateLinkForm';

export default CreateLinkForm;