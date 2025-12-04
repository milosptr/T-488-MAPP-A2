import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    View as RNView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { TouchableOpacity as GHTouchableOpacity, Swipeable } from 'react-native-gesture-handler';

import { SafeAreaScreen } from '@/src/components';
import { Text, View } from '@/src/components/ui/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useImportContacts } from '@/src/hooks/useImportContacts';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import type { Contact } from '@/src/types';



const AVATAR_SIZE = 48;

export const ContactsListScreen = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const contacts = useStore(state => state.contacts);
    const deleteContact = useStore(state => state.deleteContact);
    const { isImporting, handleImport } = useImportContacts();

    const filteredAndSortedContacts = useMemo(() => {
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [contacts, searchQuery]);

    const handleAddContact = useCallback(() => {
        router.push('/modals/add-contact');
    }, []);

    const handleContactPress = useCallback((contact: Contact) => {
        router.push(`/contacts/${contact.id}`);
    }, []);

    const handleDeleteContact = useCallback((contactId: string, contactName: string) => {
        Alert.alert(
            'Delete Contact',
            `Are you sure you want to delete ${contactName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteContact(contactId),
                },
            ]
        );
        }, [deleteContact]);

    const renderContactItem = useCallback(
    ({ item }: { item: Contact }) => {
        let swipeableRef: Swipeable | null = null;

        return (
        <Swipeable
            ref={(ref) => { swipeableRef = ref; }}
            friction={2}
            leftThreshold={40}
            rightThreshold={40}
            overshootLeft={false}
            overshootRight={false}
            onSwipeableOpen={(direction) => {
                if (direction === 'right') {
                    handleDeleteContact(item.id, item.name);
                    swipeableRef?.close();
                } else if (direction === 'left') {
                    router.push(`/modals/edit-contact/${item.id}` as any);
                    swipeableRef?.close();
                }
            }}
            renderLeftActions={() => (
                <View
                    style={[
                        styles.contactItem,
                        {
                            backgroundColor: '#4c67ffff',
                            borderWidth: 1,
                            borderColor: theme.outline,
                        },
                        ]}
                >
                    <Ionicons name="pencil" size={24} color="white" />
                    <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Edit</Text>
                </View>
            )}
            renderRightActions={() => (
                <View
                    style={[
                        styles.contactItem,
                        {
                            backgroundColor: '#df2b0bff',
                            borderWidth: 1,
                            borderColor: theme.outline,
                        },
                        ]}
                >
                    <Ionicons name="trash" size={24} color="white" />
                    <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Delete</Text>
                </View>
            )}
            >
            <GHTouchableOpacity
                onPress={() => handleContactPress(item)}
                activeOpacity={0.55}
                style={[
                styles.contactItem,
                {
                    backgroundColor: theme.surface,
                    borderWidth: 1,
                    borderColor: theme.outline,
                },
                ]}
            >
                {item.image ? (
                <Image source={{ uri: item.image }} style={styles.avatar} />
                ) : (
                <RNView
                    style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: theme.primaryContainer },
                    ]}
                >   
                    <Text style={[styles.avatarText, { color: theme.onPrimaryContainer }]}>
                    {item.name.charAt(0).toUpperCase()}
                    </Text>
                </RNView>
                )}

                <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={[styles.contactPhone, { color: theme.onSurfaceVariant }]}>
                    {item.phoneNumber}
                </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={theme.onSurfaceVariant} />
            </GHTouchableOpacity>
        </Swipeable>
        );
    },
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

    return (
        <SafeAreaScreen style={{ backgroundColor: theme.background }}>
            <View style={styles.header}>
                <Text style={styles.title}>Contacts</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: theme.secondaryContainer }]}
                        onPress={handleImport}
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
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
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
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.md,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    avatarPlaceholder: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
    },
    contactPhone: {
        fontSize: 14,
        marginTop: 2,
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
