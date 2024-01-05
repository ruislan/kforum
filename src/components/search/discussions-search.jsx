'use client';

import _ from 'lodash';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import NoContent from '../ui/no-content';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import DiscussionListItem from '../discussion/discussion-list-item';
import { DISCUSSION_SORT, DISCUSSION_SORT_NAMES } from '@/lib/constants';

export default function DiscussionsSearch({ query }) {
    const searchParams = useSearchParams();
    const sort = searchParams.get('sort') || DISCUSSION_SORT[0];

    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search/discussions?q=${query}&sort=${sort}&page=${page}`);
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
        <div className='flex flex-1 flex-col gap-2'>
            <div className='flex items-center gap-1.5 mb-2'>
                {DISCUSSION_SORT.map((v, i) => (
                    <Link
                        key={i}
                        className={clsx(
                            'px-3 py-2 rounded-lg font-semibold',
                            'hover:text-gray-200 hover:bg-neutral-700',
                            v === sort ? 'text-gray-200 bg-neutral-700' : 'text-gray-400'
                        )}
                        href={`/search?q=${query}&sort=${v}`}
                    >
                        {DISCUSSION_SORT_NAMES[v]}
                    </Link>
                ))}
            </div>
            {dataList.map((item, i) => <DiscussionListItem key={i} discussion={item} isCardStyle />)}
            {
                isLoading ?
                    <Spinner center /> :
                    (dataList.length === 0) && <NoContent text='没有搜索到结果，换个词试试？' />
            }
            {
                hasMore && (
                    <div className='self-center py-2'>
                        <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                    </div>
                )
            }
        </div>
    );
}