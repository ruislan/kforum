'use client';


import { useRouter, useSearchParams } from 'next/navigation';
import DiscussionsSearch from './discussions-search';
import PostsSearch from './posts-search';
import UsersSearch from './users-search';
import { CheckIcon } from '../icons';
import { HeadingSmall } from '../ui/heading';
import Box from '../ui/box';
import clsx from 'clsx';

const tabs = [
    { value: 'default', name: '话题' },
    { value: 'posts', name: '帖子' },
    { value: 'users', name: '用户' },
];

export default function SearchTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get('type') || 'default';
    const query = searchParams.get('q') || '';

    return (
        <div className='flex md:flex-row flex-col w-full h-full gap-6'>
            <div className='flex flex-col md:flex-1 order-2 md:order-1'>
                {type === 'default' && <DiscussionsSearch query={query} />}
                {type === 'posts' && <PostsSearch query={query} />}
                {type === 'users' && <UsersSearch query={query} />}
            </div>
            <div className='flex flex-col md:w-80 w-full order-1 md:order-2'>
                <Box className='flex md:flex-col flex-row'>
                    <div className='flex md:flex-col flex-row gap-1'>
                        {tabs.map((tab, index) => {
                            const isChecked = tab.value === type;
                            return (<div
                                key={index}
                                className={clsx(
                                    'flex items-center md:justify-between gap-1 p-2',
                                    'rounded text-sm font-semibold cursor-pointer ',
                                    isChecked ? 'bg-neutral-700 text-gray-200' : 'hover:bg-neutral-700 text-gray-400'
                                )}
                                onClick={e => {
                                    e.preventDefault();
                                    let path = `/search?q=${query}`;
                                    if (index > 0) path += `&type=${tabs[index].value}`;
                                    router.push(path);
                                }}
                            >
                                <span>{tab.name}</span>
                                {isChecked && <span className='h-4 w-4'><CheckIcon /></span>}
                            </div>);
                        })}
                    </div>
                </Box>
            </div>
        </div>
    );
}
