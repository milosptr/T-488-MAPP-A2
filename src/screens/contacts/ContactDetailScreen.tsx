import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, Image, Linking, StyleSheet, TouchableOpacity, View as RNView } from 'react-native';

import { SafeAreaScreen } from '@/src/components';
import { Text, View } from '@/src/components/ui/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';

const AVATAR_SIZE = 120;

export const ContactDetailScreen = () => {
    const theme = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const contact = useStore(state => state.getContactById(id));
    const deleteContact = useStore(state => state.deleteContact);

    const handleCall = useCallback(() => {
        if (!contact?.phoneNumber) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const phoneUrl = `tel:${contact.phoneNumber}`;
        Linking.canOpenURL(phoneUrl).then(supported => {
            if (supported) {
                Linking.openURL(phoneUrl);
            } else {
                Alert.alert('Error', 'Phone calls are not supported on this device');
            }
        });
    }, [contact?.phoneNumber]);

    const handleEdit = useCallback(() => {
        if (!contact) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/modals/edit-contact/${contact.id}`);
    }, [contact]);

    const handleDelete = useCallback(() => {
        if (!contact) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'Delete Contact',
            `Are you sure you want to delete ${contact.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteContact(contact.id);
                        router.back();
                    },
                },
            ],
            { cancelable: true }
        );
    }, [contact, deleteContact]);

    const formattedDate = useMemo(() => {
        if (!contact?.createdAt) return null;
        return new Date(contact.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, [contact?.createdAt]);

    if (!contact) {
        return (
            <SafeAreaScreen style={{ backgroundColor: theme.background }}>
                <View style={styles.notFound}>
                    <Ionicons name="person-outline" size={64} color={theme.onSurfaceVariant} />
                    <Text style={[styles.notFoundText, { color: theme.onSurfaceVariant }]}>
                        Contact not found
                    </Text>
                </View>
            </SafeAreaScreen>
        );
    }

    return (
        <SafeAreaScreen edges={['bottom']} style={{ backgroundColor: theme.background }}>
            <View style={styles.container}>
                <View style={styles.avatarSection}>
                    {contact.image ? (
                        <Image source={{ uri: contact.image }} style={styles.avatar} />
                    ) : (
                        <RNView
                            style={[
                                styles.avatarPlaceholder,
                                { backgroundColor: theme.primaryContainer },
                            ]}
                        >
                            <Text style={[styles.avatarText, { color: theme.onPrimaryContainer }]}>
                                {contact.name.charAt(0).toUpperCase()}
                            </Text>
                        </RNView>
                    )}
                    <Text style={styles.name}>{contact.name}</Text>
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.success }]}
                        onPress={handleCall}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="call" size={24} color={theme.onSuccess} />
                        <Text style={[styles.actionText, { color: theme.onSuccess }]}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.primary }]}
                        onPress={handleEdit}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="pencil" size={24} color={theme.onPrimary} />
                        <Text style={[styles.actionText, { color: theme.onPrimary }]}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={[
                        styles.infoCard,
                        { backgroundColor: theme.surface, borderColor: theme.outline },
                    ]}
                >
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color={theme.primary} />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: theme.onSurfaceVariant }]}>
                                Phone
                            </Text>
                            <Text style={styles.infoValue}>{contact.phoneNumber}</Text>
                        </View>
                    </View>

                    {formattedDate && (
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: theme.onSurfaceVariant }]}>
                                    Added
                                </Text>
                                <Text style={styles.infoValue}>{formattedDate}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: theme.errorContainer }]}
                    onPress={handleDelete}
                    activeOpacity={0.8}
                >
                    <Ionicons name="trash-outline" size={20} color={theme.error} />
                    <Text style={[styles.deleteText, { color: theme.error }]}>Delete Contact</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFoundText: {
        fontSize: 16,
        marginTop: spacing.lg,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
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
        fontSize: 48,
        fontWeight: '600',
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: spacing.lg,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginBottom: spacing.xl,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        padding: spacing.lg,
        gap: spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginTop: spacing.xl,
        gap: spacing.sm,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
