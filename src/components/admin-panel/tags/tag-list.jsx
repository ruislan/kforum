'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Box from '@/components/ui/box';
import Button from '@/components/ui/button';
import { HeadingSmall } from '@/components/ui/heading';
import Spinner from '@/components/ui/spinner';
import Input from '@/components/ui/input';
import NoContent from '@/components/ui/no-content';
import Tag from '@/components/ui/tag';


export default function TagList() {
    const [isLoading, setIsLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const router = useRouter();
    const queryRef = useRef();

    const fetchDataList = useCallback(async () => {
        setIsLoading(true);
        try {
            let url = `/api/admin/tags?page=${page}`;
            const query = queryRef.current.value;
            if (query) url += `&q=${query}`;
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                setDataList(prev => page > 1 ? [...prev, ...json.data] : json.data);
                setHasMore(json.hasMore);
            } else {
                toast.error('未知错误，请刷新重试');
            }
        } catch (err) {
            toast.error('未知错误，请刷新重试');
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    const onSearchClick = async () => {
        setDataList([]);
        page > 1 ? setPage(1) : fetchDataList();
    };

    const onNewClick = async () => router.push('/admin-panel/tags/create');

    useEffect(() => {
        fetchDataList();
    }, [fetchDataList]);

    return (
        <Box className='flex flex-col'>
            <HeadingSmall>标签列表</HeadingSmall>
            <div className='flex items-center gap-2 mb-3'>
                <Input
                    ref={queryRef}
                    placeholder='名称'
                    onKeyUp={e => {
                        if (e.key === 'Enter') onSearchClick();
                    }}
                />
                <Button onClick={e => {
                    e.preventDefault();
                    onSearchClick();
                }}>
                    搜索
                </Button>
                <Button onClick={e => {
                    e.preventDefault();
                    onNewClick();
                }}>
                    新增
                </Button>
            </div>
            <div className='flex flex-wrap px-0.5 gap-2'>
                {dataList.map((tag, index) => (
                    <Tag
                        key={index}
                        color={tag.textColor}
                        bgColor={tag.bgColor}
                        onClick={e => {
                            e.preventDefault();
                            router.push(`/admin-panel/tags/${tag.id}`)
                        }}
                    >
                        {tag.name}
                    </Tag>
                ))}
                {!isLoading && dataList.length === 0 && <NoContent noWrap text='没有数据' />}
            </div>
            {isLoading && <Spinner className='self-center' />}
            {hasMore && (
                <div className='self-center py-2'>
                    <Button kind='ghost' disabled={isLoading} onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </Box>
    );
}