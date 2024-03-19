import toast from 'react-hot-toast';
import { create } from 'zustand';

const useAdminTagsStore = create((set, get) => ({
    tags: [],
    page: 1,
    query: '',
    isLoading: false,
    hasMore: false,
    fetchTags: async (query, page) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true });

        try {
            let url = `/api/admin/tags?page=${page}`;
            if (query) url += `&q=${query}`;
            const res = await fetch(url);
            const json = await res.json();
            set((state) => ({
                tags: page === 1 ? [...json.data] : [...state.tags, ...json.data],
                page: page,
                query: query,
                hasMore: json.hasMore,
            }));
        } catch (err) {
            toast.error('未知错误，请刷新重试');
        }
        set({ isLoading: false });
    },
}));

export default useAdminTagsStore;
