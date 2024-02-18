'use client';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import NoContent from '../ui/no-content';
import { NOTIFICATION_TYPES } from '@/lib/constants';
import Box from '../ui/box';
import UserAvatar from '../ui/user-avatar';
import dateUtils from '@/lib/date-utils';
import SplitBall from '../ui/split-ball';

function NewPost({ notification }) {
    return (
        <Box className='flex gap-2'>
            <div className='flex'>
                <UserAvatar
                    name={notification.data.user.name}
                    avatar={notification.data.user.avatar}
                />
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center text-gray-300'>
                    <Link
                        href={`/u/${notification.data.user.name}`}
                        onClick={e => e.stopPropagation()}
                        className='text-xs hover:underline underline-offset-2 cursor-pointer'
                    >
                        u/{notification.data.user.name}
                    </Link>
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs'>回帖了主题</span>
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(notification.createdAt)}</span>
                </div>
                <div className='w-full break-words text-sm'>
                    <Link
                        href={`/d/${notification.data.discussion.id}`}
                        className='hover:underline underline-offset-2 cursor-pointer'
                    >
                        {notification.data.discussion.title}
                    </Link>
                </div>
                <div className='w-full mt-2 px-4 py-2 bg-neutral-700 rounded-lg shadow-md'>
                    <Link
                        href={`/d/${notification.data.discussion.id}`}
                        className='text-sm hover:underline underline-offset-2 cursor-pointer'
                    >
                        {notification.data.discussion.title}
                    </Link>
                </div>
            </div>
        </Box>
    );
}


function NewDiscussion({ notification }) {

    return (
        <Box className='flex gap-2'>
            <div className='flex'>
                <UserAvatar
                    name={notification.data.user.name}
                    avatar={notification.data.user.avatar}
                />
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center text-gray-300'>
                    <Link
                        href={`/u/${notification.data.user.name}`}
                        onClick={e => e.stopPropagation()}
                        className='text-xs hover:underline underline-offset-2 cursor-pointer'
                    >
                        u/{notification.data.user.name}
                    </Link>
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs'>发布了新的话题</span>
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(notification.createdAt)}</span>
                </div>
                <Link
                    href={`/d/${notification.data.discussion.id}`}
                    className='text-sm hover:underline underline-offset-2 cursor-pointer'
                >
                    {notification.data.discussion.title}
                </Link>
            </div>
        </Box>
    );
}

export default function NotificationList() {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let url = `/api/notifications?page=${page}`;
                const res = await fetch(url);
                if (res.ok) {
                    const json = await res.json();
                    // setDataList(prev => [...prev, ...json.data]);
                    setDataList([
                        {
                            type: NOTIFICATION_TYPES.NEW_DISCUSSION,
                            data: {
                                discussion: {
                                    id: 1,
                                    title: 'somesomesomesomesomesomesomesomesome',
                                },
                                user: {
                                    id: 1,
                                    name: 'admin',
                                    avatar: '/uploads/2024/02/02/bb36492b64f5b4560d2a7053c22df8f84a839054.jpeg',
                                }
                            },
                            isRead: false,
                            createdAt: new Date(),
                        },
                        {
                            type: NOTIFICATION_TYPES.NEW_POST,
                            data: {
                                discussion: {
                                    id: 1,
                                    title: 'somesomesomesomesomesomesomesomesomesome',
                                },
                                post: {
                                    id: 1,
                                    content: 'some some some some',
                                },
                                user: {
                                    id: 1,
                                    name: 'admin',
                                    avatar: '/uploads/2024/02/02/bb36492b64f5b4560d2a7053c22df8f84a839054.jpeg',
                                }
                            },
                            isRead: false,
                            createdAt: new Date(),
                        }
                    ]);
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
    }, [page]);

    if (!isLoading && dataList.length === 0) return <NoContent text={`没有新的通知信息`} />;
    return (
        <div className='flex flex-col gap-2'>
            {dataList.map((item, index) => {
                switch (item.type) {
                    case NOTIFICATION_TYPES.NEW_DISCUSSION:
                        return <NewDiscussion key={index} notification={item} />;
                    case NOTIFICATION_TYPES.NEW_POST:
                        return <NewPost key={index} notification={item} />;
                    default:
                        return null;
                }
            })}
            {isLoading && <Spinner className='self-center' />}
            {hasMore && !isLoading && (
                <div className='self-center py-2'>
                    <Button
                        kind='ghost'
                        disabled={isLoading}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        查看更多
                    </Button>
                </div>
            )}
        </div>
    );
}
