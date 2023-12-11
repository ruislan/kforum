import { create } from 'zustand';

const useRegisterModal = create((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export default useRegisterModal;