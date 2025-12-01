import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

interface StoreState {
    _hasHydrated: boolean;
}

const useStoreBase = create<StoreState>()(
    persist((_set, getState) => ({ _hasHydrated: getState()._hasHydrated || false }), {
        name: 'mapp-store',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: state => ({
            ...state,
        }),
        onRehydrateStorage: () => () => {
            useStoreBase.setState({ _hasHydrated: true });
        },
    })
);

export const useStore = useStoreBase;

export function useShallowStore<T>(selector: (state: StoreState) => T): T {
    return useStoreBase(useShallow(selector));
}
