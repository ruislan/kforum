'use client';

import clsx from 'clsx';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import UserTabsDiscussions from './user-tabs-discussions';
import UserTabsPosts from './user-tabs-posts';
import UserTabsBookmarks from './user-tabs-bookmarks';
import { useSession } from 'next-auth/react';

/* user tabs
    1. overview(activities) v3
    2. discussions
    3. posts
    4. Bookmark
    5. following
    6. followers
*/
const tabs = [
    { slug: 'discussions', name: '话题', relativePath: '/' },
    { slug: 'posts', name: '帖子', relativePath: '/posts' },
    { slug: 'bookmarks', name: '收藏', relativePath: '/bookmarks', self: true },
];

export default function UserTabs({ user, tab }) {
    const router = useRouter();
    const { data } = useSession();

    // user can only view his own bookmarks
    const isSelf = data?.user?.name === user.name;
    if (!isSelf && tabs.some(t => t.self && t.slug === tab)) return null;

    return (
        <Tab.Group manual
            selectedIndex={!tab ? 0 : tabs.findIndex(t => t.slug === tab)}
            onChange={(index => router.push(`/u/${user.name}${tabs[index].relativePath}`))}
        >
            <Tab.List className='flex items-center gap-2 rounded-md bg-neutral-800 border border-solid border-neutral-700 mb-4 px-2 py-1.5'>
                {tabs?.filter(tab => !tab.self || (tab.self && isSelf)).map((tab) => (
                    <Tab key={tab.name} className={({ selected }) =>
                        clsx('rounded-md py-2 px-4 text-sm font-semibold text-gray-100 focus:outline-none',
                            selected ? 'bg-neutral-700/80 shadow-lg' : 'text-gray-100 hover:bg-neutral-700/80 hover:text-gray')}>
                        {tab.name}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel><UserTabsDiscussions user={user} /></Tab.Panel>
                <Tab.Panel><UserTabsPosts user={user} /></Tab.Panel>
                {isSelf && <Tab.Panel><UserTabsBookmarks user={user} /></Tab.Panel>}
            </Tab.Panels>
        </Tab.Group>
    );
}
