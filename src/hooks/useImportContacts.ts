import * as Contacts from 'expo-contacts';
import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { useStore } from '@/src/store/useStore';
import type { Contact } from '@/src/types';

export const useImportContacts = () => {
    const [isImporting, setIsImporting] = useState(false);
    const importContacts = useStore(state => state.importContacts);
    const existingContacts = useStore(state => state.contacts);

    const requestPermission = useCallback(async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        return status === 'granted';
    }, []);

    const handleImport = useCallback(async () => {
        setIsImporting(true);

        try {
            const hasPermission = await requestPermission();

            if (!hasPermission) {
                Alert.alert(
                    'Permission Required',
                    'Please grant contacts permission to import your contacts.'
                );
                setIsImporting(false);
                return;
            }

            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
            });

            if (data.length === 0) {
                Alert.alert('No Contacts', 'No contacts found on your device.');
                setIsImporting(false);
                return;
            }

            const validContacts = data.filter(
                contact => contact.name && contact.phoneNumbers && contact.phoneNumbers.length > 0
            );

            if (validContacts.length === 0) {
                Alert.alert('No Valid Contacts', 'No contacts with name and phone number found.');
                setIsImporting(false);
                return;
            }

            const existingPhones = new Set(
                existingContacts.map(c => c.phoneNumber.replace(/\D/g, ''))
            );

            const newContacts: Contact[] = [];
            let skippedCount = 0;

            for (const contact of validContacts) {
                const phoneNumber = contact.phoneNumbers?.[0]?.number || '';
                const normalizedPhone = phoneNumber.replace(/\D/g, '');

                if (existingPhones.has(normalizedPhone)) {
                    skippedCount++;
                    continue;
                }

                existingPhones.add(normalizedPhone);

                const now = new Date().toISOString();
                newContacts.push({
                    id: Crypto.randomUUID(),
                    name: contact.name || 'Unknown',
                    phoneNumber,
                    photo: contact.image?.uri || null,
                    createdAt: now,
                    updatedAt: now,
                });
            }

            if (newContacts.length > 0) {
                await importContacts(newContacts);
            }

            const message =
                skippedCount > 0
                    ? `Imported ${newContacts.length} contacts. Skipped ${skippedCount} duplicates.`
                    : `Successfully imported ${newContacts.length} contacts.`;

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Import Complete', message);
        } catch (error) {
            console.error('Error importing contacts:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Import Failed', 'An error occurred while importing contacts.');
        } finally {
            setIsImporting(false);
        }
    }, [requestPermission, importContacts, existingContacts]);

    return {
        isImporting,
        handleImport,
    };
};
