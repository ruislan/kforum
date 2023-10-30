'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

import Box from '../ui/box';
import NoContent from '../ui/no-content';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import SplitBall from '../ui/split-ball';
import dateUtils from '@/lib/date-utils';

export default function UsersSearch({ query }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search/users?q=${query}&page=${page}`);
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
    }, [page, query]);
    if (!isLoading && dataList.length === 0) return <NoContent text='没有搜索到结果，换个词试试？' />

    return (
        <div className='flex flex-col gap-2'>
            {dataList.map((item, i) => (
                <Box key={i} className='flex items-center gap-2'>
                    <div className='flex justify-center items-center'>
                        <Image className='rounded'
                            src={item.avatar}
                            width={36}
                            height={36}
                            alt={item.name}
                        />
                    </div>
                    <div className='flex items-center text-sm'>
                        <Link
                            href={`/u/${item.name}`}
                            className='text-sm font-semibold text-gray-300 hover:text-gray-200 underline underline-offset-2'
                        >
                            u/{item.name}
                        </Link>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='text-sm text-gray-400'>注册于 {dateUtils.fromNow(item.createdAt)}</span>
                    </div>
                </Box>
            ))}
            {isLoading && <Spinner />}
            {
                hasMore && (
                    <div className='self-center py-2'>
                        <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                    </div>
                )
            }
        </div>
    );
}