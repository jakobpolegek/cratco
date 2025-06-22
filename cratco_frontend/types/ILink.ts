export interface ILink {
    _id: string;
    name: string;
    originalAddress: string;
    customAddress: string;
    status: 'active' | 'inactive';
    startDate: Date;
    renewalDate: Date;
    user: string;
    createdAt?: Date;
    updatedAt?: Date;
    visits?: number;
}