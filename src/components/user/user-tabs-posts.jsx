'use client';

import { useEffect, useState } from 'react';
import Box from '../ui/box';
import toast from 'react-hot-toast';
import NoContent from '../ui/no-content';
import Button from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import SplitBall from '../ui/split-ball';
import DateUtils from '@/lib/date-utils';
import ProseContent from '../ui/prose-content';
import { LoadingIcon, Locked, Pined } from '../icons';

// 只列出用户的回帖（非讨论首贴）
export default function UserTabsPosts({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users/${user.name}/posts?page=${page}`);
                if (res.ok) {
                    const json = await res.json();
                    // xxx 按照d分组处理 v0.8.0
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

    if (!isLoading && dataList.length === 0) {
        return <NoContent text={`嗯，看来 u/${user.name} 还在潜水`} />;
    }

    return (
        <div className='text-sm text-neutral-100 flex flex-col gap-2'>
            {dataList.map((item, i) => (
                <Box key={i} className='flex flex-col text-sm pl-0 pr-0 pt-0 pb-0'>
                    <div className='flex items-center p-2 border-b border-neutral-700'>
                        <span className='text-xs text-gray-400 mr-1.5 mt-0.5'>回复</span>
                        <Link href={`/d/${item.discussion.id}`} className='hover:underline underline-offset-2 cursor-pointer'>{item.discussion.title}</Link>
                        {item.discussion.isSticky && (<span className='h-4 w-4 ml-1.5 text-green-400'><Pined /></span>)}
                        {item.discussion.isLocked && (<span className='h-3.5 w-3.5 ml-0.5 text-yellow-400'><Locked /></span>)}
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <Link href={`/c/${item.discussion.category.slug}`} className='text-xs text-gray-200 hover:underline underline-offset-2 cursor-pointer'>c/{item.discussion.category.name}</Link>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <Link className='text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer' href={`/u/${item.discussion.user.name}`}>u/{item.discussion.user.name}</Link>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='text-xs text-gray-400'>{DateUtils.fromNow(item.discussion.createdAt)}</span>
                    </div>
                    <div className='flex flex-col p-2'>
                        <div className='flex items-center mb-1'>
                            <Link className='text-xs text-gray-400 hover:underline underline-offset-2 cursor-pointer' href={`/u/${user.name}`} onClick={e => e.stopPropagation()}>u/{user.name}</Link>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs text-gray-400'>{DateUtils.fromNow(item.createdAt)}</span>
                        </div>
                        <ProseContent content={item.content} />
                    </div>
                </Box>
            ))}
            {isLoading && <div className='flex justify-center mt-4'><LoadingIcon className='w-8 h-8' /></div>}
            {hasMore && (
                <div className='self-center py-2'>
                    <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </div>
    );
}