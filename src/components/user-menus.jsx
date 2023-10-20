'use client';

import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Box from './ui/box';

const links = [
    { href: '/u/Admin', label: '个人中心' },
    { href: '/settings', label: '用户设置' },
    { type: 'separator' },
    { href: '/sign-out', label: '退出' },
]

export default function UserMenus() {

    return (
        <Menu as='div' className='relative inline-block text-left'>
            <Menu.Button>
                <div className='w-9 h-9 bg-gray-300 rounded cursor-pointer'>
                    <Image width='36' height='36' className='w-full h-full rounded'
                        loader={_ => 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&size=96'}
                        src='Aneka'
                        alt='user avatar' />
                </div>
            </Menu.Button>
            <Transition as={Fragment}
                enter='transition ease-out duration-100' enterFrom='transform opacity-0 scale-95' enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75' leaveFrom='transform opacity-100 scale-100' leaveTo='transform opacity-0 scale-95'
            >
                <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <Box className='flex flex-col'>
                        {links.map((link, index) => (
                            link.type === 'separator' ? <div key={index} className='my-1 h-px bg-neutral-700/70' /> :
                                <Menu.Item key={index} className='h-10 px-2 text-sm font-semibold hover:bg-neutral-700/70 rounded flex items-center' as={Fragment}>
                                    <a href={link.href}>
                                        {link.label}
                                    </a>
                                </Menu.Item>
                        ))}
                    </Box>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}