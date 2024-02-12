'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import dateUtils from '@/lib/date-utils';

import Box from '../ui/box';
import NoContent from '../ui/no-content';
import Button from '../ui/button';
import SplitBall from '../ui/split-ball';
import ProseContent from '../ui/prose-content';
import Spinner from '../ui/spinner';

import { LockedIcon, PinedIcon } from '../icons';
import UserMark from '../ui/user-mark';
import DiscussionMark from '../ui/discussion-mark';
import UserAvatar from '../ui/user-avatar';
import Image from 'next/image';
import clsx from 'clsx';

// 只列出用户的回帖（非话题首贴）
export default function UserTabsPosts({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users/${user.name}/posts?page=${page}`);
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
    }, [page, user]);

    useEffect(() => {
        const groupList = [];
        dataList.forEach(post => {
            let d = groupList.find(d => d.id === post.discussionId);
            if (!d) {
                d = post.discussion;
                d.posts = [];
                groupList.push(d);
            }
            d.posts.push(post);
        });
        groupList.forEach(d => d.posts.reverse());
        setGroupList(groupList);
    }, [dataList]);

    if (!isLoading && dataList.length === 0) {
        return <NoContent text={`嗯，看来 u/${user.name} 还在潜水`} />;
    }

    return (
        <div className='text-sm text-neutral-100 flex flex-col gap-2'>
            {groupList.map((discussion, i) => (
                <Box key={i} className='flex flex-col text-sm pl-0 pr-0 pt-0 pb-0'>
                    {/* <div className='inline p-2 border-b border-neutral-700'>
                        <span className='inline-block align-middle text-xs text-gray-400 mr-1.5 mt-0.5'>话题</span>
                        <Link href={`/d/${discussion.id}`} className='inline align-middle hover:underline underline-offset-2 cursor-pointer'>{discussion.title}</Link>
                        {discussion.isSticky && (<span className='inline-block align-middle h-4 w-4 ml-1.5 text-green-400'><PinedIcon /></span>)}
                        {discussion.isLocked && (<span className='inline-block align-middle h-3.5 w-3.5 ml-0.5 text-yellow-400'><LockedIcon /></span>)}
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <Link href={`/c/${discussion.category.slug}`} className='inline-block align-middle text-xs text-gray-200 hover:underline underline-offset-2 cursor-pointer'>c/{discussion.category.name}</Link>
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <Link className='inline-block align-middle text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer' href={`/u/${discussion.user.name}`}>u/{discussion.user.name}</Link>
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='inline-block align-middle text-xs text-gray-400' suppressHydrationWarning>{dateUtils.fromNow(discussion.createdAt)}</span>
                    </div> */}
                    <div className='flex items-center p-2 text-gray-300'>
                        <div className='flex items-center'>
                            {discussion.category.icon ?
                                <span className='mr-1.5'>
                                    <Image
                                        width={20}
                                        height={20}
                                        alt={discussion.category.name}
                                        src={discussion.category.icon}
                                        className='w-5 h-5 rounded'
                                    />
                                </span> :
                                <span
                                    className='w-5 h-5 rounded mr-1.5'
                                    style={{ backgroundColor: `${discussion.category.color || 'bg-gray-300'}`, }}
                                />
                            }
                            <Link
                                href={`/c/${discussion.category.slug}`}
                                onClick={e => e.stopPropagation()}
                                className='text-xs text-gray-300 whitespace-nowrap hover:underline underline-offset-2 cursor-pointer'>
                                c/{discussion.category.name}
                            </Link>
                        </div>
                        <SplitBall className='mx-1.5 bg-gray-300' />
                        <div className='flex items-center'>
                            <UserAvatar
                                size='xs'
                                className='mr-1.5'
                                name={discussion.user?.name}
                                avatar={discussion.user?.avatarUrl}
                            />
                            <Link
                                href={`/u/${discussion.user?.name}`}
                                onClick={e => e.stopPropagation()}
                                className='text-xs hover:underline underline-offset-2 cursor-pointer'>
                                u/{discussion.user?.name}
                            </Link>
                            <UserMark
                                isAdmin={discussion.user?.isAdmin}
                                isModerator={discussion.user?.isModerator}
                                isLocked={discussion.user?.isLocked}
                            />
                        </div>
                        <SplitBall className='mx-1.5 bg-gray-300' />
                        <span
                            className='inline-block align-middle text-xs text-gray-300 whitespace-nowrap'
                            suppressHydrationWarning
                        >
                            {dateUtils.fromNow(discussion.createdAt)}
                        </span>
                        <DiscussionMark isSticky={discussion.isSticky} isLocked={discussion.isLocked} />
                    </div>
                    <div className='inline pb-2 px-2 border-b border-neutral-700 w-full break-words'>
                        <Link
                            href={`/d/${discussion.id}`}
                            className={clsx(
                                'inline hover:underline underline-offset-2 cursor-pointer',
                            )}>
                            {discussion.title}
                        </Link>
                    </div>
                    <div className='flex flex-col gap-2 p-2'>
                        {discussion.posts.map((post, i) => (
                            <div key={i} className='flex flex-col'>
                                <div className='flex items-center'>
                                    <Link
                                        className='text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer'
                                        href={`/u/${user.name}`}
                                        onClick={e => e.stopPropagation()}>
                                        u/{user.name}
                                    </Link>
                                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                                    <span className='text-xs text-gray-400' suppressHydrationWarning>
                                        {dateUtils.fromNow(post.createdAt)}
                                    </span>
                                </div>
                                <ProseContent content={post.content} />
                            </div>
                        ))}
                    </div>
                </Box>
            ))}
            {isLoading && <Spinner center />}
            {hasMore && !isLoading && (
                <div className='self-center py-2'>
                    <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </div>
    );
}
