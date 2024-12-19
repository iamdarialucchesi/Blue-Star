import {create} from 'zustand';

const useWhiteLabelsStore = create((set) => ({
    allOrganizations: [],

    setAllOrganizations: (organizations) => set({ allOrganizations: organizations }),
}));


export { useWhiteLabelsStore
};
