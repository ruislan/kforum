'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';
import ActionButton from '@/components/ui/action-button';
import { LoadingIcon, ModeratorFilledIcon, ModeratorIcon } from '@/components/icons';

export default function ActionModerator({ user, onUpdated }) {
    const [isModerator, setIsModerator] = useState(user.isModerator);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newState = !isModerator;
            const res = await fetch(`/api/admin/users/${user.id}/moderator`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ isModerator: newState }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                toast.success(newState ? '已经成功设置为版主' : '已经成功取消版主');
                setIsModerator(newState);
                runIfFn(onUpdated, newState);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
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
            handleClick();
        }}>
            {isLoading ? <LoadingIcon /> :
                (isModerator ? <ModeratorFilledIcon /> : <ModeratorIcon />)
            }
        </ActionButton>
    );
}