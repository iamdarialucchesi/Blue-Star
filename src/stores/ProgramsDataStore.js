import {create} from 'zustand';
import {persist} from "zustand/middleware";

const useProgramsDataStore = create(
    persist(
        (set) => ({
            programName: false,
            SNSPhoneNumbers: [],

            setProgramName: (newRef) => set({ programName: newRef }),
            setSNSPhoneNumbers: (phoneNumbers) => set({ SNSPhoneNumbers: phoneNumbers }),
        }),
        {
            name: 'program-data-store',
            getStorage: () => localStorage,
        }
    )
);


export { useProgramsDataStore
};
