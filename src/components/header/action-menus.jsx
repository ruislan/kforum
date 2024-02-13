'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import NotificationMenu from './notification-menu';
import { PlusIcon } from '../icons';

export default function ActionMenus() {
    const { data } = useSession();

    if (!data) return null;

    return (
        <div className='flex items-center'>
            <NotificationMenu />
            <Link
                title='新话题'
                href='/d/create'
                className='flex items-center justify-center w-9 h-9 text-gray-300 p-4 hover:bg-neutral-700 rounded-md'
            >
                <span className='flex w-7 h-7'>
                    <PlusIcon />
                </span>
            </Link>
        </div>
    );
}
