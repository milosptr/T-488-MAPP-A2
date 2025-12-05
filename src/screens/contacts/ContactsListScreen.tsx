import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { ContactItem, SafeAreaScreen } from '@/src/components';
import { SwipeableRow } from '@/src/components/ui/SwipeableRow';
import { Text, View } from '@/src/components/ui/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useImportContacts } from '@/src/hooks/useImportContacts';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import type { Contact } from '@/src/types';

export const ContactsListScreen = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const contacts = useStore(state => state.contacts);
    const deleteContact = useStore(state => state.deleteContact);
    const resetContacts = useStore(state => state.resetContacts);
    const { isImporting, handleImport } = useImportContacts();

    const filteredAndSortedContacts = useMemo(() => {
        const filtered = contacts.filter(
            contact =>
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.phoneNumber.includes(searchQuery)
        );

        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [contacts, searchQuery]);

    const handleAddContact = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/modals/add-contact');
    }, []);

    const handleImportWithHaptics = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleImport();
    }, [handleImport]);

    const handleClearSearch = useCallback(() => {
        Haptics.selectionAsync();
        setSearchQuery('');
    }, []);

    const handleContactPress = useCallback((contact: Contact) => {
        router.push(`/contacts/${contact.id}`);
    }, []);

    const handleDeleteContact = useCallback(
        (contactId: string, contactName: string) => {
            Alert.alert('Delete Contact', `Are you sure you want to delete ${contactName}?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => deleteContact(contactId),
                },
            ]);
        },
        [deleteContact]
    );

    const renderContactItem = useCallback(
        ({ item }: { item: Contact }) => (
            <SwipeableRow
                leftAction={{
                    icon: 'pencil',
                    label: 'Edit',
                    backgroundColor: theme.action,
                    onAction: () =>
                        router.push({
                            pathname: '/modals/edit-contact/[id]',
                            params: { id: item.id },
                        }),
                }}
                rightAction={{
                    icon: 'trash',
                    label: 'Delete',
                    backgroundColor: theme.error,
                    onAction: () => handleDeleteContact(item.id, item.name),
                }}
            >
                <ContactItem item={item} onPress={() => handleContactPress(item)} />
            </SwipeableRow>
        ),
        [theme, handleContactPress, handleDeleteContact]
    );

    const renderEmptyState = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color={theme.onSurfaceVariant} />
                <Text style={[styles.emptyTitle, { color: theme.onSurface }]}>
                    {searchQuery ? 'No contacts found' : 'No contacts yet'}
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.onSurfaceVariant }]}>
                    {searchQuery
                        ? 'Try a different search term'
                        : 'Tap + to add a contact or import from your device'}
                </Text>
            </View>
        ),
        [theme, searchQuery]
    );

    const handleResetContacts = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Reset Contacts', 'Are you sure you want to reset all your contacts?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: async () => resetContacts() },
        ]);
    }, [resetContacts]);

    return (
        <SafeAreaScreen style={{ backgroundColor: theme.background }}>
            <View style={styles.header}>
                <Text style={styles.title}>Contacts</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: theme.errorContainer }]}
                        onPress={handleResetContacts}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="sync" size={24} color={theme.onPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: theme.secondaryContainer }]}
                        onPress={handleImportWithHaptics}
                        activeOpacity={0.8}
                        disabled={isImporting}
                    >
                        {isImporting ? (
                            <ActivityIndicator size="small" color={theme.onSecondaryContainer} />
                        ) : (
                            <Ionicons
                                name="download-outline"
                                size={22}
                                color={theme.onSecondaryContainer}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: theme.primary }]}
                        onPress={handleAddContact}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={24} color={theme.onPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={[
                    styles.searchContainer,
                    {
                        backgroundColor: theme.surfaceVariant,
                        borderWidth: 1,
                        borderColor: theme.outline,
                    },
                ]}
            >
                <Ionicons name="search" size={20} color={theme.onSurfaceVariant} />
                <TextInput
                    style={[styles.searchInput, { color: theme.onSurface }]}
                    placeholder="Search contacts..."
                    placeholderTextColor={theme.onSurfaceVariant}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleClearSearch}>
                        <Ionicons name="close-circle" size={20} color={theme.onSurfaceVariant} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={filteredAndSortedContacts}
                keyExtractor={item => item.id}
                renderItem={renderContactItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaScreen>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        flexGrow: 1,
        gap: spacing.sm,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: spacing.lg,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});
