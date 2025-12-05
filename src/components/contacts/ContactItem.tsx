import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Image, Pressable, View as RNView, StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/ui/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import type { Contact } from '@/src/types';

const AVATAR_SIZE = 48;

interface ContactItemProps {
    item: Contact;
    onPress: () => void;
}

export const ContactItem = memo(({ item, onPress }: ContactItemProps) => {
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.pressableContainer,
                {
                    backgroundColor: theme.surface,
                    borderWidth: 1,
                    borderColor: theme.outline,
                },
            ]}
        >
            {({ pressed }) => (
                <View
                    style={{
                        ...styles.container,
                        opacity: pressed ? 0.75 : 1,
                    }}
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

                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={[styles.phone, { color: theme.onSurfaceVariant }]}>
                            {item.phoneNumber}
                        </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color={theme.onSurfaceVariant} />
                </View>
            )}
        </Pressable>
    );
});

ContactItem.displayName = 'ContactItem';

const styles = StyleSheet.create({
    pressableContainer: {
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
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
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    phone: {
        fontSize: 14,
        marginTop: 2,
    },
});
