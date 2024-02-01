'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';
import ActionButton from '../ui/action-button';
import { LoadingIcon, NotificationIcon, NotificationFillIcon } from '../icons';


export default function ActionFollow({ discussion, onFollowed }) {
    const [isFollowed, setIsFollowed] = useState(discussion.isFollowed);
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newState = !isFollowed;
            let res = null;
            if (isFollowed) {
                res = await fetch(`/api/discussions/${discussion.id}/follow`, { method: 'DELETE' });
            } else {
                res = await fetch(`/api/discussions/${discussion.id}/follow`, { method: 'POST' });
            }
            if (res?.ok) {
                toast.success(newState ? '已经关注' : '已经取消关注');
                setIsFollowed(newState);
                runIfFn(onFollowed, newState);
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
            handleAction();
        }}>
            {isLoading ? <LoadingIcon /> :
                (isFollowed ? <NotificationFillIcon /> : <NotificationIcon />)
            }
        </ActionButton>
    );
}