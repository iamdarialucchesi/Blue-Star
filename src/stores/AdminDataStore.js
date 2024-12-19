import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminDataStore = create(
    persist(
        (set) => ({
            loginUser: {},
            resendTokenSend: false,
            adminUserData: {},
            globalUserName: null,
            globalProfilePicture: null,
            isLogout: false,


            setLoginUser: (adminInfo) => set({ loginUser: adminInfo }),
            setResendTokenSend: (tokenSend) => set({ resendTokenSend: tokenSend }),
            setAdminUserData: (admin) => set({ adminUserData: admin }),
            setGlobalUserName: (name) => set({ globalUserName: name }),
            setGlobalProfilePicture: (name) => set({ globalProfilePicture: name }),
            setIsLogout: (logout) => set({ isLogout: logout }),
        }),
        {
            name: 'admin-data-store',
            getStorage: () => localStorage,
        }
    )
);

export { useAdminDataStore };
