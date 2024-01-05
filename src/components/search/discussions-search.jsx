'use client';

import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NoContent from '../ui/no-content';
import Spinner from '../ui/spinner';
import Button from '../ui/button';
import DiscussionListItem from '../discussion/discussion-list-item';
import SorterBox from './sorter-box';

const sorterList = [
    { name: '最新', value: 'recent' },
    { name: '最热', value: 'hot' },
];

export default function DiscussionsSearch({ query }) {
    const [isLoading, setIsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [sorter, setSorter] = useState(sorterList[0]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                let queryUrl = `/api/search/discussions?q=${query}&page=${page}`;
                if (sorter?.value) queryUrl += `&sort=${sorter.value}`;
                const res = await fetch(queryUrl);
                if (res.ok) {
                    const json = await res.json();
                    setDataList(prev => page < 2 ? json.data : [...prev, ...json.data]);
                    setHasMore(json.hasMore);
                } else {
                    toast.error('未知错误，请刷新重试');
                }
            } catch (err) {
                console.log(err);
                toast.error('未知错误，请刷新重试');
            } finally {
                setIsLoading(false);
            }
        })();
    }, [page, query, sorter]);

    if (!query) return <NoContent text='没有提供搜索词，输入搜索词试试？' />;
    if (!isLoading && dataList.length === 0) return <NoContent text='没有搜索到结果，换个词试试？' />;

    return (
        <div className='flex w-full gap-6'>
            <div className='flex flex-1 flex-col gap-2'>
                {dataList.map((item, i) => <DiscussionListItem key={i} discussion={item} isCardStyle />)}
                {isLoading && <Spinner center />}
                {
                    hasMore && (
                        <div className='self-center py-2'>
                            <Button kind='ghost' onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                        </div>
                    )
                }
            </div>
            {/* right side */}
            <div className='flex flex-col w-80 gap-2'>
                <SorterBox
                    sorterList={sorterList}
                    selected={sorter}
                    onClick={index => {
                        setPage(1);
                        setDataList([]);
                        setSorter(sorterList[index]);
                    }}
                />
            </div>
        </div>
    );
}