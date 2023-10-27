'use client';

import clsx from 'clsx';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import UserTabsOverview from './user-tabs-overview';
import UserTabsDiscussions from './user-tabs-discussions';
import UserTabsPosts from './user-tabs-posts';

const tabs = [
    { slug: 'overview', name: '概览', relativePath: '' },
    { slug: 'discussions', name: '主题', relativePath: '/discussions' },
    { slug: 'posts', name: '回帖', relativePath: '/posts' },
];

export default function UserTabs({ user, tab }) {
    const router = useRouter();
    return (
        <Tab.Group manual
            selectedIndex={!tab ? 0 : tabs.findIndex(t => t.slug === tab)}
            onChange={(index => router.push(`/u/${user.name}${tabs[index].relativePath}`))}
        >
            <Tab.List className='flex space-x-1 rounded-md bg-neutral-800 border border-solid border-neutral-700 px-2 py-1.5'>
                {tabs?.map((tab) => (
                    <Tab key={tab.name} className={({ selected }) =>
                        clsx('rounded-md py-2 px-4 text-sm font-semibold text-gray-100 focus:outline-none',
                            selected ? 'bg-neutral-700/80 shadow-lg' : 'text-gray-100 hover:bg-neutral-700/80 hover:text-gray')}>
                        {tab.name}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels className='mt-2'>
                <Tab.Panel><UserTabsOverview user={user} /></Tab.Panel>
                <Tab.Panel><UserTabsDiscussions user={user} /></Tab.Panel>
                <Tab.Panel><UserTabsPosts user={user} /></Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
