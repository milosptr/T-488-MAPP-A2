import { Stack } from 'expo-router';

export default function ModalsLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: 'modal',
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="add-contact"
                options={{
                    title: 'Add Contact',
                }}
            />
            <Stack.Screen
                name="edit-contact/[id]"
                options={{
                    title: 'Edit Contact',
                }}
            />
        </Stack>
    );
}
