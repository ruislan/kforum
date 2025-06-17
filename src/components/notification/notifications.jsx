'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import NotificationList from './notification-list';
import useNotificationStore from '@/hooks/use-notification-store';

function ActionClean() {
    const isDeleting = useNotificationStore((state) => state.isDeleting);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);

    return (
        <div
            className='flex items-center cursor-pointer hover:text-gray-50'
            onClick={async e => {
                e.preventDefault();
                await clearNotifications();
                return false;
            }}
        >
            <span>{isDeleting ? '清空中...' : '清空'}</span>
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
