'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

import UserInfo from './user-info';

// show u/{username}
// when hover it ,show the user's info
export default function UserFancyLink({ user }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;
    return (
        <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className='relative flex'
        >
            <Link
                href={`/u/${user?.name}`}
                onClick={e => e.stopPropagation()}
                className='text-xs hover:underline underline-offset-2 cursor-pointer'>
                u/{user?.name}
            </Link>
            <Transition
                as={Fragment}
                show={isOpen}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <div className={clsx(
                    'absolute z-50 mb-1 top-full overflow-auto',
                    'text-sm text-gray-200 outline-none',
                    'rounded-md bg-neutral-800 shadow-lg',
                    ' min-w-52',
                )}>
                    <UserInfo user={user} />
                </div>
            </Transition>
        </div>
    );
}
