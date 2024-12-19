import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrganizationDataStore = create(
    persist(
        (set) => ({
            organizationData: {},
            organizationPractice: {},
            organizationReload: false,
            organizationPracticeNames: [],
            organizationPracticeStates: [],
            organizationFilterKey: '',
            organizationRoles: [],
            practiceRoles: [],

            setOrganizationData: (newOrganization) => set({ organizationData: newOrganization }),
            setOrganizationPractice: (newRef) => set({ organizationPractice: newRef }),
            setOrganizationReload: (reloadState) => set({ organizationReload: reloadState }),
            setOrganizationPracticeNames: (practiceNames) => set({ organizationPracticeNames: practiceNames }),
            setOrganizationPracticeStates: (practiceStates) => set({ organizationPracticeStates: practiceStates }),
            setOrganizationFilterKey: (filterKey) => set({ organizationFilterKey: filterKey }),
            setOrganizationRoles: (roles) => set({ organizationRoles: roles }),
            setPracticeRoles: (roles) => set({ practiceRoles: roles }),
        }),
        {
            name: 'organization-data-store', // Key to store the data in localStorage
            getStorage: () => localStorage,  // Use localStorage for persistence
        }
    )
);

export { useOrganizationDataStore };
