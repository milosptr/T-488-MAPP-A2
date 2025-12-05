export interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    image: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateContactInput = Partial<Omit<Contact, 'id'>> & {
    id: string;
};
