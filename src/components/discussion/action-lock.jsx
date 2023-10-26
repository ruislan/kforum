'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';

import { LoadingIcon, Lock } from '../icons';
import ActionButton from '../ui/action-button';

export default function ActionLock({ discussion, onLocked }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLock = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const isLocked = !discussion.isLocked;
            const res = await fetch(`/api/discussions/${discussion.id}/lock`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ isLocked }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                toast.success(isLocked ? '已经成功锁定' : '已经成功解锁');
                runIfFn(onLocked, isLocked);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 401) {
                    toast.error('您的登录以过期，请重新登录');
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
            handleLock();
        }}>
            {isLoading ? <LoadingIcon /> : <Lock />}
        </ActionButton>
    );
}