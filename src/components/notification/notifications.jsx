'use client';

import NotificationList from './notification-list';

export default function Notifications() {
    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex items-center justify-between mb-8'>
                <h2 className='text-3xl font-bold'>通知</h2>
            </div>
            <NotificationList />
        </div>
    );
}
