import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { SafeAreaScreen } from '@/src/components';
import { Button } from '@/src/components/ui/Button';
import { TextInput } from '@/src/components/ui/TextInput';
import { Text, View } from '@/src/components/ui/Themed';
import { spacing } from '@/src/constants/DesignTokens';
import { useContactForm } from '@/src/hooks/useContactForm';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';

const AVATAR_SIZE = 100;

export const AddContactScreen = () => {
    const theme = useTheme();
    const addContact = useStore(state => state.addContact);

    const {
        name,
        phoneNumber,
        photo,
        errors,
        setName,
        setPhoneNumber,
        setPhoto,
        validate,
        getFormData,
    } = useContactForm();

    const { showImageOptions } = useImagePicker({
        onImageChange: setPhoto,
        showRemoveOption: false,
    });

    const handleSubmit = useCallback(async () => {
        if (!validate()) return;

        await addContact(getFormData());
        router.back();
    }, [validate, addContact, getFormData]);

    return (
        <SafeAreaScreen edges={['bottom']} style={{ backgroundColor: theme.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
                            {photo ? (
                                <Image source={{ uri: photo }} style={styles.avatar} />
                            ) : (
                                <RNView
                                    style={[
                                        styles.avatarPlaceholder,
                                        {
                                            backgroundColor: theme.surfaceVariant,
                                            borderWidth: 1,
                                            borderColor: theme.outline,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name="camera"
                                        size={36}
                                        color={theme.onSurfaceVariant}
                                    />
                                </RNView>
                            )}
                            <RNView style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                                <Ionicons name="add" size={16} color={theme.onPrimary} />
                            </RNView>
                        </TouchableOpacity>
                        <Text style={[styles.avatarHint, { color: theme.onSurfaceVariant }]}>
                            Tap to add photo
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            label="Name"
                            placeholder="Enter contact name"
                            value={name}
                            onChangeText={setName}
                            error={errors.name}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />

                        <TextInput
                            label="Phone Number"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            error={errors.phoneNumber}
                            keyboardType="phone-pad"
                            autoCorrect={false}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button title="Save Contact" onPress={handleSubmit} size="large" />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaScreen>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
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
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarHint: {
        fontSize: 14,
        marginTop: spacing.sm,
    },
    form: {
        flex: 1,
    },
    footer: {
        padding: spacing.lg,
        paddingTop: spacing.sm,
    },
});
