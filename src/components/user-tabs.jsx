'use client';

import clsx from 'clsx';
import { Tab } from '@headlessui/react';
import Box from './ui/box';

const titles = ['概览', '发帖', '回复', '收藏'];

export default function UserTabs() {
    return (
        <Tab.Group manual>
            <Tab.List className='flex space-x-1 rounded-md bg-neutral-800 p-1'>
                {titles.map((title) => (
                    <Tab key={title} className={({ selected }) =>
                        clsx('rounded-md py-2 px-4 text-sm font-semibold text-gray-100 focus:outline-none',
                            selected ? 'bg-white/[0.12] shadow-lg' : 'text-gray-100 hover:bg-white/[0.12] hover:text-gray')}>
                        {title}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels className='mt-2'>
                {titles.map((title) => (
                    <Tab.Panel key={title} className='flex flex-col gap-2'>
                        <Box>{title}</Box>
                        <Box>{title}</Box>
                        <Box>{title}</Box>
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
}
