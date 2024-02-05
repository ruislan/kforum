'use client';

import NotificationList from './notification-list';

export default function Notifications() {
    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex items-baseline justify-between my-8'>
                <h2 className='text-3xl font-bold'>通知</h2>
                <div className='flex items-center gap-2 text-gray-200 text-sm'>
                    <span>设置</span>
                    <span>标记为已读</span>
                </div>
            </div>
            <NotificationList />
        </div>
    );
}
