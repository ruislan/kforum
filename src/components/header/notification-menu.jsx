'use client';

import Link from 'next/link';
import { NotificationIcon } from '../icons';

export default function NotificationMenu({ hasNew = false }) {
    return (
        <>
            <Link
                href='/notifications'
                title='通知'
                className='flex items-center justify-center w-9 h-9 text-gray-300 p-4 hover:bg-neutral-700 rounded-md cursor-pointer'
            >
                <span className='relative flex w-5 h-5'>
                    <NotificationIcon />
                    {hasNew && <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full' />}
                </span>
            </Link>
        </>
    );
}
