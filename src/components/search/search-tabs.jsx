'use client';

import clsx from 'clsx';
import { Tab } from '@headlessui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DiscussionsSearch from './discussions-search';
import PostsSearch from './posts-search';
import UsersSearch from './users-search';

const tabs = [
    { type: 'default', name: '话题' },
    { type: 'posts', name: '帖子' },
    { type: 'users', name: '用户' },
];

export default function SearchTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const type = searchParams.get('type') || '';
    const query = searchParams.get('q') || '';
    return (
        <Tab.Group manual
            selectedIndex={!type ? 0 : tabs.findIndex(t => t.type === type)}
            onChange={(index => {
                let path = `/search?q=${query}`;
                if (index > 0) path += `&type=${tabs[index].type}`;
                router.push(path);
            })}
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
                <Tab.Panel><DiscussionsSearch query={query} /></Tab.Panel>
                <Tab.Panel><PostsSearch query={query} /></Tab.Panel>
                <Tab.Panel><UsersSearch query={query} /></Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
