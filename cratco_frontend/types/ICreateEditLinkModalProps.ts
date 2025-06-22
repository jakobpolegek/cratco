import {ILink} from "@/types/ILink";

export interface ICreateEditLinkModalProps {
    onClose: () => void;
    editLink?: ILink | null;
    mode?: 'create' | 'edit';
}