import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
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
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';

const AVATAR_SIZE = 100;

export const EditContactScreen = () => {
    const theme = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const contact = useStore(state => state.getContactById(id));
    const updateContact = useStore(state => state.updateContact);

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>({});

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setPhoneNumber(contact.phoneNumber);
            setImage(contact.image);
        }
    }, [contact]);

    const pickImage = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant camera roll permissions to add a photo.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    }, []);

    const takePhoto = useCallback(async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    }, []);

    const showImageOptions = useCallback(() => {
        const options = [
            { text: 'Take Photo', onPress: takePhoto },
            { text: 'Choose from Library', onPress: pickImage },
        ];

        if (image) {
            options.push({
                text: 'Remove Photo',
                onPress: async () => {
                    setImage(null);
                },
            });
        }

        options.push({ text: 'Cancel', onPress: async () => {} });

        Alert.alert('Change Photo', 'Choose an option', options);
    }, [takePhoto, pickImage, image]);

    const validate = useCallback(() => {
        const newErrors: { name?: string; phoneNumber?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, phoneNumber]);

    const handleSubmit = useCallback(() => {
        if (!contact || !validate()) return;

        updateContact({
            id: contact.id,
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            image,
        });

        router.back();
    }, [contact, validate, updateContact, name, phoneNumber, image]);

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
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatar} />
                            ) : (
                                <RNView
                                    style={[
                                        styles.avatarPlaceholder,
                                        { backgroundColor: theme.surfaceVariant },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.avatarText,
                                            { color: theme.onSurfaceVariant },
                                        ]}
                                    >
                                        {name.charAt(0).toUpperCase() || '?'}
                                    </Text>
                                </RNView>
                            )}
                            <RNView style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                                <Ionicons name="pencil" size={12} color={theme.onPrimary} />
                            </RNView>
                        </TouchableOpacity>
                        <Text style={[styles.avatarHint, { color: theme.onSurfaceVariant }]}>
                            Tap to change photo
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
                    <Button title="Save Changes" onPress={handleSubmit} size="large" />
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
    avatarText: {
        fontSize: 40,
        fontWeight: '600',
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
