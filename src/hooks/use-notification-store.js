import toast from 'react-hot-toast';
import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    page: 1,
    isLoading: false,
    isDeleting: false,
    hasMore: false,
    error: null,
    fetchNotifications: async () => {
        const { page, isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true });
        const res = await fetch(`/api/notifications?page=${page}`);
        const json = await res.json();
        set((state) => ({
            notifications: page === 1 ? [...json.data] : [...state.notifications, ...json.data],
            page: state.page + 1,
            isLoading: false,
            hasMore: json.hasMore,
        }));
    },
    clearNotifications: async () => {
        set({ isDeleting: true, error: null });
        try {
            const res = await fetch('/api/notifications/clear', {
                method: 'DELETE',
            });
            if (res?.ok) {
                set({
                    notifications: [],
                    page: 1,
                    isLoading: false,
                    isDeleting: false
                });
                toast.success('清空成功');
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    set({ error: json.message });
                } else if (res.status === 403) {
                    set({ error: '您没有权限进行此操作' });
                } else if (res.status === 401) {
                    set({ error: '您的登录已过期，请重新登录' });
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            set({ error: '未知错误，请重新尝试，或者刷新页面' });
        }
        set({ isDeleting: false });

        const { error } = get();
        if (error) toast.error(error);
    },
}));

export default useNotificationStore;
