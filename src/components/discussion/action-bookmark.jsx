'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

import { runIfFn } from '@/lib/fn';
import useLoginModal from '@/hooks/use-login-modal';
import ActionButton from '../ui/action-button';
import { BookmarkIcon, LoadingIcon, BookmarkedIcon } from '../icons';


export default function ActionBookmark({ post, onBookmarked }) {
    const loginModal = useLoginModal();
    const { data } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newState = !isBookmarked;
            let res = null;
            if (isBookmarked) {
                res = await fetch(`/api/bookmarks`, {
                    method: 'DELETE',
                    body: JSON.stringify({ postId: post.id }),
                    headers: { 'Content-Type': 'application/json' }
                });

            } else {
                res = await fetch(`/api/bookmarks`, {
                    method: 'POST',
                    body: JSON.stringify({ postId: post.id }),
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (res?.ok) {
                toast.success(newState ? '已经成功收藏' : '已经成功取消收藏');
                setIsBookmarked(newState);
                runIfFn(onBookmarked, newState);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 403) {
                    toast.error('您没有权限进行此操作');
                } else if (res.status === 401) {
                    toast.error('您的登录已过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            toast.error('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <ActionButton onClick={e => {
            e.preventDefault();
            if (!data?.user) loginModal.open();
            else handleAction();
        }}>
            {isLoading ? <LoadingIcon /> :
                (isBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />)
            }
        </ActionButton>
    );
}