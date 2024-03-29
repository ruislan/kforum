'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import dateUtils from '@/lib/date-utils';
import { USER_SORT, USER_SORT_NAMES } from '@/lib/constants';

import Box from '../ui/box';
import NoContent from '../ui/no-content';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import SplitBall from '../ui/split-ball';
import UserAvatar from '../ui/user-avatar';
import UserFancyLink from '../user/user-fancy-link';

export default function UsersSearch({ query }) {
    const searchParams = useSearchParams();
    const sort = searchParams.get('sort') || USER_SORT[0];

    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search/users?q=${query}&sort=${sort}&page=${page}`);
                if (res.ok) {
                    const json = await res.json();
                    setDataList(prev => page < 2 ? json.data : [...prev, ...json.data]);
                    setHasMore(json.hasMore);
                } else {
                    toast.error('未知错误，请刷新重试');
                }
            } catch (err) {
                toast.error('未知错误，请刷新重试');
            } finally {
                setIsLoading(false);
            }
        })();
    }, [page, query, sort]);

    if (!query) return <NoContent text='没有提供搜索词，输入搜索词试试？' />;

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1 mb-2'>
                {USER_SORT.map((v, i) => (
                    <Link
                        key={i}
                        className={clsx(
                            'px-3 py-2 rounded-lg font-semibold',
                            'hover:text-gray-200 hover:bg-neutral-700',
                            v === sort ? 'text-gray-200 bg-neutral-700' : 'text-gray-400'
                        )}
                        href={`/search?q=${query}&type=users&sort=${v}`}
                    >
                        {USER_SORT_NAMES[v]}
                    </Link>
                ))}
            </div>
            {dataList.map((item, i) => (
                <Box key={i} className='flex items-center gap-2'>
                    <div className='flex justify-center items-center'>
                        <UserAvatar
                            avatar={item.avatarUrl}
                            name={item.name}
                        />
                    </div>
                    <div className='flex items-center text-xs'>
                        <UserFancyLink user={item} />
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='text-gray-400' suppressHydrationWarning>注册于 {dateUtils.fromNow(item.createdAt)}</span>
                    </div>
                </Box>
            ))}
            {
                isLoading ?
                    <Spinner center /> :
                    (dataList.length === 0 && <NoContent text='没有搜索到结果，换个词试试？' />)
            }
            {
                hasMore && !isLoading && (
                    <div className='self-center py-2'>
                        <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                    </div>
                )
            }
        </div>
    );
}
