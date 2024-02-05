'use client';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import NoContent from '../ui/no-content';
import { NOTIFICATION_TYPES } from '@/lib/constants';
import Box from '../ui/box';

function NotificationCard({ notification }) {
    return (
        <Box>
            <div className='flex items-center gap-2'>
                <span className='font-bold'>u/{notification.data.user.name}</span>
                <span>发布了新的话题</span>
                <div className='text-sm'>{new Date().toLocaleString()}</div>
            </div>
            <span className=''>{notification.data.title}</span>
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
                                discussionId: 1,
                                title: 'some',
                                user: {
                                    name: 'admin'
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
            {dataList.map((item, index) => (
                <NotificationCard key={index} notification={item} />
            ))}
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
