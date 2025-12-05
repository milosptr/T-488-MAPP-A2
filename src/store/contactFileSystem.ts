import { Directory, File, Paths } from 'expo-file-system';

import type { Contact } from '@/src/types';

const CONTACTS_DIR = 'contacts';

/**
 * Sanitize contact name for use in filename
 * Removes special characters and replaces spaces with underscores
 */
export const sanitizeName = (name: string): string => {
    const sanitized = name
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 50);
    return sanitized || 'Unknown';
};

/**
 * Generate filename in format: Name-uuid.json
 */
export const getContactFilename = (name: string, id: string): string => {
    return `${sanitizeName(name)}-${id}.json`;
};

/**
 * Get reference to contacts directory
 */
export const getContactsDir = (): Directory => {
    return new Directory(Paths.document, CONTACTS_DIR);
};

/**
 * Ensure contacts directory exists, create if not
 */
export const ensureContactsDir = async (): Promise<void> => {
    const dir = getContactsDir();
    if (!dir.exists) {
        await dir.create();
    }
};

/**
 * Write a single contact to its own JSON file
 */
export const writeContactFile = async (contact: Contact): Promise<void> => {
    await ensureContactsDir();
    const filename = getContactFilename(contact.name, contact.id);
    const file = new File(getContactsDir(), filename);
    await file.write(JSON.stringify(contact));
};

/**
 * Delete a specific contact file
 */
export const deleteContactFile = async (name: string, id: string): Promise<void> => {
    const filename = getContactFilename(name, id);
    const file = new File(getContactsDir(), filename);
    if (file.exists) {
        await file.delete();
    }
};

/**
 * Read all contacts from the contacts directory
 */
export const readAllContacts = async (): Promise<Contact[]> => {
    const dir = getContactsDir();
    if (!dir.exists) {
        return [];
    }

    const items = await dir.list();
    const jsonFiles = items.filter(
        (item): item is File => item instanceof File && item.name.endsWith('.json')
    );

    const results = await Promise.all(
        jsonFiles.map(async file => {
            try {
                const content = await file.text();
                return JSON.parse(content) as Contact;
            } catch (error) {
                console.error(`Error reading contact file ${file.name}:`, error);
                return null;
            }
        })
    );

    return results.filter((c): c is Contact => c !== null);
};
