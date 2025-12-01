import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import type { Contact, CreateContactInput, UpdateContactInput } from '@/src/types';

interface StoreState {
    contacts: Contact[];
    addContact: (input: CreateContactInput) => Contact;
    updateContact: (input: UpdateContactInput) => void;
    deleteContact: (id: string) => void;
    getContactById: (id: string) => Contact | undefined;
    importContacts: (contacts: Contact[]) => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const useStoreBase = create<StoreState>()(
    persist(
        (set, get) => ({
            contacts: [],

            addContact: (input: CreateContactInput) => {
                const now = new Date().toISOString();
                const newContact: Contact = {
                    id: generateId(),
                    ...input,
                    createdAt: now,
                    updatedAt: now,
                };
                set(state => ({
                    contacts: [...state.contacts, newContact],
                }));
                return newContact;
            },

            updateContact: (input: UpdateContactInput) => {
                set(state => ({
                    contacts: state.contacts.map(contact =>
                        contact.id === input.id
                            ? {
                                  ...contact,
                                  ...input,
                                  updatedAt: new Date().toISOString(),
                              }
                            : contact
                    ),
                }));
            },

            deleteContact: (id: string) => {
                set(state => ({
                    contacts: state.contacts.filter(contact => contact.id !== id),
                }));
            },

            getContactById: (id: string) => {
                return get().contacts.find(contact => contact.id === id);
            },

            importContacts: (contacts: Contact[]) => {
                set(state => ({
                    contacts: [...state.contacts, ...contacts],
                }));
            },
        }),
        {
            name: 'mapp-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({
                contacts: state.contacts,
            }),
            onRehydrateStorage: () => () => {},
        }
    )
);

export const useStore = useStoreBase;

export function useShallowStore<T>(selector: (state: StoreState) => T): T {
    return useStoreBase(useShallow(selector));
}
