'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Plus } from '../icons';

export default function ActionPlus() {
    const { data } = useSession();
    if (!data?.user?.isAdmin) return null;
    return (
        <Link href='/admin-panel/category'
            className='w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-50 transition-all'>
            <Plus />
        </Link>
    );
}