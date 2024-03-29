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

export default function UserTabsBookmarks({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users/${user.name}/bookmarks?page=${page}`);
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
        dataList.forEach(bookmark => {
            let d = groupList.find(d => d.id === bookmark.post.discussionId);
            if (!d) {
                d = bookmark.post.discussion;
                d.posts = [];
                groupList.push(d);
            }
            d.posts.push(bookmark.post);
        });
        groupList.forEach(d => d.posts.reverse());
        setGroupList(groupList);
    }, [dataList]);

    if (!isLoading && dataList.length === 0) {
        return <NoContent text={`嗯，看来 u/${user.name} 还没有中意的内容`} />;
    }

    return (
        <div className='text-sm text-neutral-100 flex flex-col gap-2'>
            {groupList.map((discussion, i) => (
                <Box key={i} className='flex flex-col text-sm pl-0 pr-0 pt-0 pb-0'>
                    <div className='inline p-2 border-b border-neutral-700'>
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
                    </div>
                    {discussion.posts.map((post, i) => (
                        <div key={i} className='flex flex-col p-2'>
                            <div className='flex items-center mb-1'>
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