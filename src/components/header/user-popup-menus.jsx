'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { Menu, Transition } from '@headlessui/react';

import Box from '../ui/box';

const menus = [
    { href: '/u/Admin', label: '个人中心' },
    { href: '/settings', label: '用户设置' },
    { type: 'separator' },
    {
        type: 'button', label: '退出', onClick: async (e) => {
            e.preventDefault();
            await signOut();
        }
    },
]

export default function UserPopupMenus() {
    const { data } = useSession();
    if (!data?.user) return null;

    return (
        <Menu as='div' className='relative inline-flex text-left'>
            <Menu.Button className='flex gap-1.5 items-center py-0.5 px-1 rounded hover:bg-neutral-700'>
                <div className='w-9 h-9 bg-gray-300 rounded'>
                    <Image width='36' height='36' className='w-full h-full rounded'
                        loader={_ => data?.user?.avatar}
                        src={data?.user?.name || 'avatar'}
                        alt={data?.user?.name} />
                </div>
                <span className='text-base text-neutral-200'>{data?.user?.name}</span>
            </Menu.Button>
            <Transition as={Fragment}
                enter='transition ease-out duration-100' enterFrom='transform opacity-0 scale-95' enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75' leaveFrom='transform opacity-100 scale-100' leaveTo='transform opacity-0 scale-95'
            >
                <Menu.Items className='absolute top-full right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <Box className='flex flex-col'>
                        {menus.map((item, index) => {
                            switch (item.type) {
                                case 'separator': return (<div key={index} className='my-1 h-px bg-neutral-700/70' />);
                                case 'button': return (
                                    <Menu.Item key={index} className='h-10 px-2 text-base font-semibold hover:bg-neutral-700/70 rounded flex items-center' as={Fragment}>
                                        <button key={index} onClick={item.onClick}>{item.label}</button>
                                    </Menu.Item>);
                                default: return (<Menu.Item key={index} className='h-10 px-2 text-base font-semibold hover:bg-neutral-700/70 rounded flex items-center' as={Fragment}>
                                    <Link href={item.href}>
                                        {item.label}
                                    </Link>
                                </Menu.Item>);
                            }
                        })}
                    </Box>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}