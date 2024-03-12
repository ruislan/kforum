'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import dateUtils from '@/lib/date-utils';
import Box from '../ui/box';
import NoContent from '../ui/no-content';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import SplitBall from '../ui/split-ball';
import ProseContent from '../ui/prose-content';
import UserAvatar from '../ui/user-avatar';
import { POST_SORT, POST_SORT_NAMES } from '@/lib/constants';
import DiscussionMark from '../ui/discussion-mark';
import UserMark from '../ui/user-mark';
import UserFancyLink from '../user/user-fancy-link';

export default function PostsSearch({ query }) {
    const searchParams = useSearchParams();
    const sort = searchParams.get('sort') || POST_SORT[0];

    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search/posts?q=${query}&sort=${sort}&page=${page}`);
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
        <div className='text-neutral-100 flex flex-1 flex-col gap-2'>
            <div className='flex items-center gap-1 mb-2'>
                {POST_SORT.map((v, i) => (
                    <Link
                        key={i}
                        className={clsx(
                            'px-3 py-2 rounded-lg font-semibold',
                            'hover:text-gray-200 hover:bg-neutral-700',
                            v === sort ? 'text-gray-200 bg-neutral-700' : 'text-gray-400'
                        )}
                        href={`/search?q=${query}&type=posts&sort=${v}`}
                    >
                        {POST_SORT_NAMES[v]}
                    </Link>
                ))}
            </div>
            {dataList.map((item, i) => (
                <Box key={i} className='flex flex-col text-sm pl-0 pr-0 pt-0 pb-0'>
                    <div className='flex items-center p-2 text-gray-300'>
                        <div className='flex items-center'>
                            {item.discussion.category.icon ?
                                <span className='mr-1.5'>
                                    <Image
                                        width={20}
                                        height={20}
                                        alt={item.discussion.category.name}
                                        src={item.discussion.category.icon}
                                        className='w-5 h-5 rounded'
                                    />
                                </span> :
                                <span
                                    className='w-5 h-5 rounded mr-1.5'
                                    style={{ backgroundColor: `${item.discussion.category.color || 'bg-gray-300'}`, }}
                                />
                            }
                            <Link
                                href={`/c/${item.discussion.category.slug}`}
                                onClick={e => e.stopPropagation()}
                                className='text-xs text-gray-300 whitespace-nowrap hover:underline underline-offset-2 cursor-pointer'>
                                c/{item.discussion.category.name}
                            </Link>
                        </div>
                        <SplitBall className='mx-1.5 bg-gray-300' />
                        <div className='flex items-center'>
                            <UserAvatar
                                size='xs'
                                className='mr-1.5'
                                name={item.discussion.user?.name}
                                avatar={item.discussion.user?.avatarUrl}
                            />
                            <UserFancyLink user={item.discussion.user} />
                            <UserMark
                                isAdmin={item.discussion.user?.isAdmin}
                                isModerator={item.discussion.user?.isModerator}
                                isLocked={item.discussion.user?.isLocked}
                            />
                        </div>
                        <SplitBall className='mx-1.5 bg-gray-300' />
                        <span className='inline-block align-middle text-xs text-gray-300 whitespace-nowrap' suppressHydrationWarning>{dateUtils.fromNow(item.discussion.createdAt)}</span>
                        <DiscussionMark isSticky={item.discussion.isSticky} isLocked={item.discussion.isLocked} />
                    </div>
                    <div className='inline pb-2 px-2 border-b border-neutral-700 w-full break-words'>
                        <Link
                            href={`/d/${item.discussion.id}`}
                            className={clsx(
                                'inline hover:underline underline-offset-2 cursor-pointer',
                            )}>
                            {item.discussion.title}
                        </Link>
                    </div>
                    <div className='flex flex-col p-2'>
                        <div className='flex items-center mb-1'>
                            <div className='flex items-center'>
                                <UserAvatar
                                    className='mr-1.5'
                                    size='xs'
                                    name={item.user.name}
                                    avatar={item.user.avatarUrl}
                                />
                                <Link
                                    href={`/u/${item.user.name}`}
                                    onClick={e => e.stopPropagation()}
                                    className='text-xs text-gray-300 hover:underline underline-offset-2 cursor-pointer'>
                                    u/{item.user.name}
                                </Link>
                                <UserMark
                                    isAdmin={item.user?.isAdmin}
                                    isModerator={item.user?.isModerator}
                                    isLocked={item.user?.isLocked}
                                />
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs text-gray-300'>{dateUtils.fromNow(item.createdAt)}</span>
                        </div>
                        <ProseContent content={item.content} />
                    </div>
                </Box>
            ))}
            {
                isLoading ?
                    <Spinner center /> :
                    (dataList.length === 0 && <NoContent text='没有搜索到结果，换个词试试？' />)
            }
            {hasMore && !isLoading && (
                <div className='self-center py-2'>
                    <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </div>
    );
}
