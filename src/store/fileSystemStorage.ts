import { File, Paths } from 'expo-file-system';
import type { StateStorage } from 'zustand/middleware';

const CONTACTS_FILENAME = 'contacts.json';

const getContactsFile = () => new File(Paths.document, CONTACTS_FILENAME);

/**
 * Custom storage adapter for Zustand that uses Expo FileSystem
 * Implements the StateStorage interface required by Zustand's persist middleware
 */
export const fileSystemStorage: StateStorage = {
    getItem: async (): Promise<string | null> => {
        try {
            const file = getContactsFile();
            if (!file.exists) {
                return null;
            }
            const content = await file.text();
            return content;
        } catch (error) {
            console.error('Error reading from FileSystem:', error);
            return null;
        }
    },

    setItem: async (_name: string, value: string): Promise<void> => {
        try {
            const file = getContactsFile();
            await file.write(value);
        } catch (error) {
            console.error('Error writing to FileSystem:', error);
            throw error;
        }
    },

    removeItem: async (): Promise<void> => {
        try {
            const file = getContactsFile();
            if (file.exists) {
                await file.delete();
            }
        } catch (error) {
            console.error('Error removing from FileSystem:', error);
        }
    },
};

export { CONTACTS_FILENAME };
