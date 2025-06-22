export interface IDeleteLinkModalProps {
    onClose: () => void;
    linkId: string;
    linkName?: string;
    shouldRedirect?: boolean;
}