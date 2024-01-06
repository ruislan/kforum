'use client';

import { Fragment, useMemo } from 'react';
import Link from 'next/link';
import { signOut, } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';

import Box from '../ui/box';
import { LogoutIcon, UserIcon } from '../icons';
import UserAvatar from '../ui/user-avatar';


export default function UserMenusDropdown({ user }) {
    const menus = useMemo(() => {
        if (!user) return [];
        const items = [
            { href: `/u/${user.name}`, label: '个人', icon: <UserIcon /> },
            { href: '/settings', label: '设置' },
        ];
        if (user.isAdmin || user.isModerator) {
            items.push({ type: 'separator' });
            items.push({ href: '/admin-panel', label: '管理员' });
        }
        items.push({ type: 'separator' });
        items.push({
            type: 'button', label: '退出',
            icon: <LogoutIcon />,
            onClick: async (e) => {
                e.preventDefault();
                await signOut();
            }
        });
        return items;
    }, [user]);

    if (!user) return null;

    return (
        <Menu as='div' className='relative inline-flex text-left'>
            <Menu.Button className='flex justify-end gap-1.5 items-center py-0.5 px-1 rounded hover:bg-neutral-700'>
                <span className='text-base text-neutral-200'>{user?.name}</span>
                <UserAvatar
                    name={user.name}
                    avatar={user.avatarUrl}
                />
            </Menu.Button>
            <Transition as={Fragment}
                enter='transition ease-out duration-100' enterFrom='transform opacity-0 scale-95' enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75' leaveFrom='transform opacity-100 scale-100' leaveTo='transform opacity-0 scale-95'
            >
                <Menu.Items className='absolute top-full right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <Box className='flex flex-col text-gray-100'>
                        {menus.map((item, index) => {
                            switch (item.type) {
                                case 'separator': return (<div key={index} className='my-1 h-px bg-neutral-700/70' />);
                                case 'button': return (
                                    <Menu.Item
                                        key={index}
                                        className='h-10 px-2 text-base font-semibold hover:bg-neutral-700/70 rounded-md flex items-center'
                                        as={Fragment}>
                                        <button onClick={item.onClick}>
                                            <span className='w-5 h-5 mr-2'>{item.icon}</span>
                                            {item.label}
                                        </button>
                                    </Menu.Item>);
                                default: return (<Menu.Item key={index} className='h-10 px-2 text-base font-semibold hover:bg-neutral-700/70 rounded-md flex items-center' as={Fragment}>
                                    <Link href={item.href}>
                                        <span className='w-5 h-5 mr-2'>{item.icon}</span>
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