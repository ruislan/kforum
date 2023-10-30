'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { LoadingIcon } from '../icons';
import Button from '../ui/button';
import NoContent from '../ui/no-content';
import DiscussionListItem from './discussion-list-item';

export default function DiscussionList({
    discussions,
    skipFirstPage = true,
    isStickyFirst = false,
    categoryId, // 如果有category说明是某个分类下面的全部话题，则无需在Item上展示分类
    hasMore: initHasMore
}) {
    const [isLoading, setIsLoading] = useState(!skipFirstPage);
    const [dataList, setDataList] = useState([...discussions]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initHasMore);

    useEffect(() => {
        if (skipFirstPage && page === 1) return;
        (async () => {
            setIsLoading(true);
            try {
                let url = `/api/discussions?page=${page}&isStickyFirst=${isStickyFirst}`;
                if (categoryId) url += `&categoryId=${categoryId}`;
                const res = await fetch(url);
                if (res.ok) {
                    const json = await res.json();
                    setDataList(prev => [...prev, ...json.data]);
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
    }, [page, skipFirstPage, isStickyFirst, categoryId]);

    if (!isLoading && dataList.length === 0) return <NoContent text={`啊，现在是空空如也`} />;

    return (
        <div className='flex flex-col gap-2'>
            {dataList.map((d, i) => <DiscussionListItem key={i} discussion={d} show />)}
            {isLoading && <div className='flex justify-center mt-4'><LoadingIcon className='w-8 h-8' /></div>}
            {hasMore && (
                <div className='self-center py-2'>
                    <Button kind='ghost' disabled={isLoading} onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </div>
    );
}
