import { create } from "zustand";

type HeaderStore = {
    hideLoginButton: boolean;
    setHideLoginButton: (hideLoginButton: boolean) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
    hideLoginButton: false,
    setHideLoginButton: (hideLoginButton) => set({ hideLoginButton }),
}));
