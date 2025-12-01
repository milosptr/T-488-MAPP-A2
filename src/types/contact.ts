/**
 * Contact model for The Contactor app
 * Based on Assignment II requirements
 */

/**
 * Represents a contact in the application
 */
export interface Contact {
    /**
     * Unique identifier for the contact
     */
    id: string;

    /**
     * Full name of the contact
     */
    name: string;

    /**
     * Phone number of the contact
     */
    phoneNumber: string;

    /**
     * Path to the contact's image/thumbnail
     * Can be a file URI (file://), remote URL, or base64 encoded string
     */
    image: string | null;

    /**
     * Timestamp when the contact was created
     */
    createdAt?: string;

    /**
     * Timestamp when the contact was last updated
     */
    updatedAt?: string;
}

/**
 * Input type for creating a new contact
 * Omits id and timestamps which are auto-generated
 */
export type CreateContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input type for updating an existing contact
 * All fields are optional except id
 */
export type UpdateContactInput = Partial<Omit<Contact, 'id'>> & {
    id: string;
};

/**
 * Contact imported from device's native contacts
 */
export interface ImportedContact {
    id: string;
    name: string;
    phoneNumbers?: Array<{
        label?: string;
        number?: string;
    }>;
    image?: {
        uri?: string;
    };
}
