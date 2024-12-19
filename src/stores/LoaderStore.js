import { create } from 'zustand';

const useLoaderStore = create((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoaderStore;
