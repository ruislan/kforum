'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import NoContent from '../ui/no-content';
import Button from '../ui/button';
import Spinner from '../ui/spinner';
import DiscussionListItem from '../discussion/discussion-list-item';

// 只列出用户的话题（含首贴）
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
                <DiscussionListItem key={i} discussion={item} />
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
