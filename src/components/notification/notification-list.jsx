'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { NOTIFICATION_TYPES } from '@/lib/constants';
import dateUtils from '@/lib/date-utils';
import useNotificationStore from '@/hooks/use-notification-store';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import NoContent from '../ui/no-content';
import Box from '../ui/box';
import UserAvatar from '../ui/user-avatar';
import SplitBall from '../ui/split-ball';
import UserFancyLink from '../user/user-fancy-link';


function NewPost({ notification }) {
    const data = useMemo(() => ({ ...JSON.parse(notification.data || '{}') }), [notification]);
    return (
        <Box className='flex gap-2'>
            <div className='flex'>
                <UserAvatar
                    name={data.user.name}
                    avatar={data.user.avatarUrl}
                />
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center text-gray-300'>
                    <UserFancyLink user={data.user} />
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs'>回帖了主题</span>
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(notification.createdAt)}</span>
                </div>
                <div className='w-full break-words text-sm'>
                    <Link
                        href={`/d/${data.discussion.id}`}
                        className='hover:underline underline-offset-2 cursor-pointer'
                    >
                        {data.discussion.title}
                    </Link>
                </div>
                <div className='w-full mt-2 px-4 py-2 bg-neutral-700 rounded-lg shadow-md'>
                    <Link
                        href={`/d/${data.discussion.id}`}
                        className='text-sm hover:underline underline-offset-2 cursor-pointer'
                    >
                        {data.discussion.title}
                    </Link>
                </div>
            </div>
        </Box>
    );
}


function NewDiscussion({ notification }) {
    const data = useMemo(() => ({ ...JSON.parse(notification.data || '{}') }), [notification]);
    return (
        <Box className='flex gap-2'>
            <div className='flex'>
                <UserAvatar
                    name={data.user.name}
                    avatar={data.user.avatarUrl}
                />
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center text-gray-300'>
                    <UserFancyLink user={data.user} />
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs'>发布了新的话题</span>
                    <SplitBall className='mx-1.5 bg-gray-300' />
                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(notification.createdAt)}</span>
                </div>
                <Link
                    href={`/d/${data.discussion.id}`}
                    className='text-sm hover:underline underline-offset-2 cursor-pointer'
                >
                    {data.discussion.title}
                </Link>
            </div>
        </Box>
    );
}

export default function NotificationList() {
    const [isLoaded, setIsLoaded] = useState(false);
    const dataList = useNotificationStore((state) => state.notifications);
    const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
    const isLoading = useNotificationStore((state) => state.isLoading);
    const hasMore = useNotificationStore((state) => state.hasMore);
    const page = useNotificationStore((state) => state.page);

    useEffect(() => {
        fetchNotifications(1).then(() => setIsLoaded(true));
    }, [fetchNotifications]);

    if (isLoaded && !isLoading && dataList.length === 0) return <NoContent text={`没有新的通知信息`} />;

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
                        onClick={() => fetchNotifications(page + 1)}
                    >
                        查看更多
                    </Button>
                </div>
            )}
        </div>
    );
}
