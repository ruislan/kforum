'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import toast from 'react-hot-toast';
import dateUtils from '@/lib/date-utils';

import Box from '../ui/box';
import NoContent from '../ui/no-content';
import Button from '../ui/button';
import SplitBall from '../ui/split-ball';
import { LoadingIcon, Locked, Pined } from '../icons';
import Spinner from '../ui/spinner';

// 只列出用户的主题主题（含首贴）
export default function UserTabsDiscussions({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users/${user.name}/discussions?page=${page}`);
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

    if (!isLoading && dataList.length === 0) return <NoContent text={`嗯，看来 u/${user.name} 还在潜水`} />;

    return (
        <div className='text-sm text-neutral-100 flex flex-col gap-2'>
            {dataList.map((item, i) => (
                <Box key={i} className='flex flex-col'>
                    <div className='inline align-middle'>
                        <Link href={`/d/${item.id}`} className='inline align-middle hover:underline underline-offset-2 cursor-pointer'>{item.title}</Link>
                        {item.isSticky && (<span className='inline-flex align-middle h-4 w-4 ml-1.5 text-green-400'><Pined /></span>)}
                        {item.isLocked && (<span className='inline-flex align-middle h-3.5 w-3.5 ml-0.5 text-yellow-400'><Locked /></span>)}
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <Link href={`/c/${item.category.slug}`} className='inline-block align-middle text-xs text-gray-200 hover:underline underline-offset-2 cursor-pointer'>c/{item.category.name}</Link>
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <Link className='inline-block align-middle text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer' href={`/u/${user.name}`}>u/{user.name}</Link>
                        <SplitBall className='inline-block align-middle ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='inline-flex align-middle text-xs text-gray-400' suppressHydrationWarning>{dateUtils.fromNow(item.createdAt)}</span>
                    </div>
                    <div className='text-xs inline-flex items-center text-gray-300 mt-1'>
                        <div className='flex items-center'><span>参与 {item.userCount}</span></div>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <div className='flex items-center'><span>帖子 {item.postCount || 0}</span></div>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <div className='flex items-center'><span>反馈 {item.reactionCount || 0}</span></div>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <div className='flex items-center'><span>浏览 {item.viewCount}</span></div>
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