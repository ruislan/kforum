'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';

import { LoadingIcon, PinIcon, PinedIcon } from '../icons';
import ActionButton from '../ui/action-button';

export default function ActionSticky({ discussion, onSticky }) {
    const [isSticky, setIsSticky] = useState(discussion.isSticky);
    const [isLoading, setIsLoading] = useState(false);

    const handleSticky = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newStickyState = !isSticky;
            const res = await fetch(`/api/discussions/${discussion.id}/sticky`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ isSticky: newStickyState }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                toast.success(newStickyState ? '置顶成功' : '取消置顶成功');
                setIsSticky(newStickyState);
                runIfFn(onSticky, newStickyState);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 401) {
                    toast.error('您的登录已过期，请重新登录');
                } else if (res.status === 403) {
                    toast.error('您没有权限进行此操作');
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
            {isLoading ?
                <LoadingIcon /> :
                (isSticky ? <PinedIcon /> : <PinIcon />)
            }
        </ActionButton>
    );
}