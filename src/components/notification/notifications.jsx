'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import NotificationList from './notification-list';
import { runIfFn } from '@/lib/fn';

function ActionClean({ onCleaned }) {
    const [isLoading, setIsLoading] = useState(false);
    const handleAction = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/notifications/clean', {
                method: 'DELETE',
            });
            if (res?.ok) {
                toast.success('清空完成');
                runIfFn(onCleaned);
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
        <div
            className='flex items-center cursor-pointer hover:text-gray-50'
            onClick={e => {
                e.preventDefault();
                handleAction();
                return false;
            }}
        >
            <span>{isLoading ? '清空中...' : '清空'}</span>
        </div>
    );
}

export default function Notifications() {
    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex items-baseline justify-between my-8'>
                <h2 className='text-3xl font-bold'>通知</h2>
                <div className='flex items-center gap-2 text-gray-200 text-sm'>
                    <ActionClean />
                </div>
            </div>
            <NotificationList />
        </div>
    );
}
