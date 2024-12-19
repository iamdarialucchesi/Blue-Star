import {create} from 'zustand';
import {persist} from "zustand/middleware";

const usePatientsDataStore = create(
    persist(
        (set) => ({
            programNames: [],
            organizationsData: {},
            organizationPractices: [],

            setProgramNames: (adminInfo) => set({programNames: adminInfo}),
            setOrganizationsData: (organizations) => set({organizationsData: organizations}),
            setOrganizationPractices: (practices) => set({organizationPractices: practices}),
        }),
        {
            name: 'patient-data-store',
            getStorage: () => localStorage,
        }
    )
);


export {
    usePatientsDataStore
};
