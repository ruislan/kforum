'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import clsx from 'clsx';

import dateUtils from '@/lib/date-utils';
import Box from '../ui/box';
import NoContent from '../ui/no-content';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import SplitBall from '../ui/split-ball';
import ProseContent from '../ui/prose-content';
import { Locked, Pined } from '../icons';
import UserAvatar from '../ui/user-avatar';

export default function PostsSearch({ query }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search/posts?q=${query}&page=${page}`);
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

    if (!query) return <NoContent text='没有提供搜索词，输入搜索词试试？' />;
    if (!isLoading && dataList.length === 0) return <NoContent text='没有搜索到结果，换个词试试？' />

    return (
        <div className='text-sm text-neutral-100 flex flex-col gap-2'>
            {dataList.map((item, i) => (
                <Box key={i} className='flex flex-col text-sm pl-0 pr-0 pt-0 pb-0'>
                    <div className='inline align-middle p-2 border-b border-neutral-700'>
                        <span className='inline align-middle text-xs whitespace-nowrap text-gray-400 mr-1.5 mt-0.5'>主题</span>
                        <Link
                            href={`/d/${item.discussion.id}`}
                            className={clsx(
                                'inline align-middle hover:underline underline-offset-2 cursor-pointer',
                            )}>
                            {item.discussion.title}
                        </Link>
                        {item.discussion.isSticky && (<span className='inline-block align-middle h-4 w-4 ml-1.5 text-green-400'><Pined /></span>)}
                        {item.discussion.isLocked && (<span className='inline-block align-middle h-3.5 w-3.5 ml-0.5 text-yellow-400'><Locked /></span>)}
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <div className='inline-flex align-middle items-center'>
                            {item.discussion.category.icon ?
                                <span className='mr-1.5'><Image alt={item.discussion.category.name} src={item.discussion.category.icon} className='w-4 h-4 rounded' /></span> :
                                <span className='w-5 h-5 rounded mr-1.5' style={{ backgroundColor: `${item.discussion.category.color || 'bg-gray-300'}`, }}></span>
                            }
                            <Link href={`/c/${item.discussion.category.slug}`} onClick={e => e.stopPropagation()}
                                className='text-xs text-gray-400 whitespace-nowrap hover:underline underline-offset-2 cursor-pointer'>c/{item.discussion.category.name}</Link>
                        </div>
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />

                        <div className='inline-flex align-middle items-center'>
                            <UserAvatar className='mr-1.5' size='xs' name={item.discussion.user.name} avatar={item.discussion.user.avatarUrl} />
                            <Link href={`/u/${item.discussion.user?.name}`} onClick={e => e.stopPropagation()} className='text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer'>u/{item.discussion.user.name}</Link>
                        </div>
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='inline-block align-middle text-xs text-gray-400 whitespace-nowrap' suppressHydrationWarning>{dateUtils.fromNow(item.discussion.createdAt)}</span>
                    </div>
                    <div className='flex flex-col p-2'>
                        <div className='flex items-center mb-1'>
                            <div className='flex items-center'>
                                <UserAvatar className='mr-1.5' size='xs' name={item.user.name} avatar={item.user.avatarUrl} />
                                <Link href={`/u/${item.user.name}`} onClick={e => e.stopPropagation()} className='text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer'>u/{item.user.name}</Link>
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs text-gray-400'>{dateUtils.fromNow(item.createdAt)}</span>
                        </div>
                        <ProseContent content={item.content} />
                    </div>
                </Box>
            ))}
            {isLoading && <Spinner center />}
            {hasMore && (
                <div className='self-center py-2'>
                    <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </div>
    );
}