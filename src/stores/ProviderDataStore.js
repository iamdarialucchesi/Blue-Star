import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProviderDataStore = create(
    persist(
        (set) => ({
            providerUserData: {},
            providerOrganizationID: null,
            providerWhiteLabels: {},

            setProviderUserData: (provider) => set({ providerUserData: provider }),
            setProviderOrganizationID: (organizationID) => set({ providerOrganizationID: organizationID }),
            setProviderWhiteLabels: (labels) => set({ providerWhiteLabels: labels }),
        }),
        {
            name: 'provider-data-store',
            getStorage: () => localStorage,
        }
    )
);

export { useProviderDataStore };
