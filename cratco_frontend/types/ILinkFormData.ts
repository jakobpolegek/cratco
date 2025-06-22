interface ILinkFormData {
    name?: string;
    originalAddress: string;
    customAddress?: string;
    _id?: string;
    mode: 'create' | 'edit';
}