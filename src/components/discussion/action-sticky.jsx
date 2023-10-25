'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';

import { LoadingIcon, Pin } from '../icons';
import ActionButton from '../ui/action-button';

export default function ActionSticky({ discussion, onSticky }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSticky = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const isSticky = !discussion.isSticky;
            const res = await fetch(`/api/discussions/${discussion.id}/sticky`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ isSticky }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                toast.success(isSticky ? '置顶成功' : '取消置顶成功');
                runIfFn(onSticky, isSticky);
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
            handleSticky();
        }}>
            {isLoading ? <LoadingIcon /> : <Pin />}
        </ActionButton>
    );
}