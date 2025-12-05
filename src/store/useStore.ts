import * as Crypto from 'expo-crypto';
import { create } from 'zustand';

import type { Contact, CreateContactInput, UpdateContactInput } from '@/src/types';

import {
    deleteContactFile,
    ensureContactsDir,
    readAllContacts,
    writeContactFile,
} from './contactFileSystem';

interface StoreState {
    contacts: Contact[];
    _isHydrated: boolean;
    addContact: (input: CreateContactInput) => Promise<Contact>;
    updateContact: (input: UpdateContactInput) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    getContactById: (id: string) => Contact | undefined;
    importContacts: (contacts: Contact[]) => Promise<void>;
    resetContacts: () => Promise<void>;
    initializeStore: () => Promise<void>;
}

const useStoreBase = create<StoreState>()((set, get) => ({
    contacts: [],
    _isHydrated: false,

    initializeStore: async () => {
        try {
            await ensureContactsDir();
            const contacts = await readAllContacts();
            set({ contacts, _isHydrated: true });
        } catch (error) {
            console.error('Error initializing store:', error);
            set({ _isHydrated: true });
        }
    },

    addContact: async (input: CreateContactInput) => {
        const now = new Date().toISOString();
        const newContact: Contact = {
            id: Crypto.randomUUID(),
            ...input,
            createdAt: now,
            updatedAt: now,
        };

        // Write to individual file
        await writeContactFile(newContact);

        // Update in-memory state
        set(state => ({
            contacts: [...state.contacts, newContact],
        }));

        return newContact;
    },

    updateContact: async (input: UpdateContactInput) => {
        const oldContact = get().contacts.find(c => c.id === input.id);
        if (!oldContact) return;

        const updatedContact: Contact = {
            ...oldContact,
            ...input,
            updatedAt: new Date().toISOString(),
        };

        // Write new file first (safe - prevents data loss)
        await writeContactFile(updatedContact);

        // Delete old file only after new file is written successfully
        if (oldContact.name !== updatedContact.name) {
            await deleteContactFile(oldContact.name, oldContact.id);
        }

        // Update in-memory state
        set(state => ({
            contacts: state.contacts.map(contact =>
                contact.id === input.id ? updatedContact : contact
            ),
        }));
    },

    deleteContact: async (id: string) => {
        const contact = get().contacts.find(c => c.id === id);
        if (!contact) return;

        // Delete the file
        await deleteContactFile(contact.name, contact.id);

        // Update in-memory state
        set(state => ({
            contacts: state.contacts.filter(c => c.id !== id),
        }));
    },

    getContactById: (id: string) => {
        return get().contacts.find(contact => contact.id === id);
    },

    importContacts: async (contacts: Contact[]) => {
        // Write all contacts to individual files in parallel
        await Promise.all(contacts.map(contact => writeContactFile(contact)));

        // Update in-memory state
        set(state => ({
            contacts: [...state.contacts, ...contacts],
        }));
    },

    resetContacts: async () => {
        const contacts = get().contacts;

        // Delete all contact files in parallel
        await Promise.all(contacts.map(contact => deleteContactFile(contact.name, contact.id)));

        set({ contacts: [] });
    },
}));

export const useStore = useStoreBase;
