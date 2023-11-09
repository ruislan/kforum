'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';
import ActionButton from '@/components/ui/action-button';
import { LoadingIcon, Lock, Locked } from '@/components/icons';


export default function ActionLock({ user, onLocked }) {
    const [isLocked, setIsLocked] = useState(user.isLocked);
    const [isLoading, setIsLoading] = useState(false);

    const handleLock = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newLockState = !isLocked;
            const res = await fetch(`/api/admin/users/${user.id}/lock`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ isLocked: newLockState }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                toast.success(newLockState ? '已经成功锁定' : '已经成功解锁');
                setIsLocked(newLockState);
                runIfFn(onLocked, newLockState);
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
            {isLoading ? <LoadingIcon /> :
                (isLocked ? <Locked /> : <Lock />)
            }
        </ActionButton>
    );
}