import { useCallback, useEffect, useState } from 'react';

import type { Contact } from '@/src/types';

interface ContactFormErrors {
    name?: string;
    phoneNumber?: string;
}

interface UseContactFormOptions {
    initialData?: Contact | null;
}

export const useContactForm = (options?: UseContactFormOptions) => {
    const { initialData } = options ?? {};

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [errors, setErrors] = useState<ContactFormErrors>({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPhoneNumber(initialData.phoneNumber);
            setPhoto(initialData.photo);
        }
    }, [initialData]);

    const validate = useCallback(() => {
        const newErrors: ContactFormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, phoneNumber]);

    const reset = useCallback(() => {
        setName('');
        setPhoneNumber('');
        setPhoto(null);
        setErrors({});
    }, []);

    const getFormData = useCallback(
        () => ({
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            photo,
        }),
        [name, phoneNumber, photo]
    );

    return {
        name,
        phoneNumber,
        photo,
        errors,
        setName,
        setPhoneNumber,
        setPhoto,
        validate,
        reset,
        getFormData,
    };
};
