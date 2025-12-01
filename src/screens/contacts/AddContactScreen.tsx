import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
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

export const AddContactScreen = () => {
    const theme = useTheme();
    const addContact = useStore(state => state.addContact);

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>({});

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
        Alert.alert('Add Photo', 'Choose an option', [
            { text: 'Take Photo', onPress: takePhoto },
            { text: 'Choose from Library', onPress: pickImage },
            { text: 'Cancel', style: 'cancel' },
        ]);
    }, [takePhoto, pickImage]);

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
        if (!validate()) return;

        addContact({
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            image,
        });

        router.back();
    }, [validate, addContact, name, phoneNumber, image]);

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
