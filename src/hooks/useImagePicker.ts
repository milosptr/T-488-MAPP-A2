import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert } from 'react-native';

interface UseImagePickerOptions {
    onImageChange: (uri: string | null) => void;
    showRemoveOption?: boolean;
    currentImage?: string | null;
}

export const useImagePicker = ({
    onImageChange,
    showRemoveOption = false,
    currentImage,
}: UseImagePickerOptions) => {
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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onImageChange(result.assets[0].uri);
        }
    }, [onImageChange]);

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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onImageChange(result.assets[0].uri);
        }
    }, [onImageChange]);

    const removeImage = useCallback(() => {
        onImageChange(null);
    }, [onImageChange]);

    const showImageOptions = useCallback(() => {
        const options: Array<{
            text: string;
            onPress?: () => void;
            style?: 'cancel' | 'destructive';
        }> = [
            { text: 'Take Photo', onPress: takePhoto },
            { text: 'Choose from Library', onPress: pickImage },
        ];

        if (showRemoveOption && currentImage) {
            options.push({
                text: 'Remove Photo',
                onPress: removeImage,
                style: 'destructive',
            });
        }

        options.push({ text: 'Cancel', style: 'cancel' });

        Alert.alert(showRemoveOption ? 'Change Photo' : 'Add Photo', 'Choose an option', options);
    }, [takePhoto, pickImage, removeImage, showRemoveOption, currentImage]);

    return {
        pickImage,
        takePhoto,
        removeImage,
        showImageOptions,
    };
};
