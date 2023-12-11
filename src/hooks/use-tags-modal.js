import { create } from 'zustand';

const useTagsModal = create((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

export default useTagsModal;