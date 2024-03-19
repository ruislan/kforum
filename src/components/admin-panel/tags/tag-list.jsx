'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Box from '@/components/ui/box';
import Button from '@/components/ui/button';
import { HeadingSmall } from '@/components/ui/heading';
import Spinner from '@/components/ui/spinner';
import Input from '@/components/ui/input';
import NoContent from '@/components/ui/no-content';
import Tag from '@/components/ui/tag';
import useAdminTagsStore from '@/hooks/use-admin-tags-store';


export default function TagList() {
    const dataList = useAdminTagsStore((state) => state.tags);
    const fetchTags = useAdminTagsStore((state) => state.fetchTags);
    const isLoading = useAdminTagsStore((state) => state.isLoading);
    const hasMore = useAdminTagsStore((state) => state.hasMore);
    const page = useAdminTagsStore((state) => state.page);

    const router = useRouter();
    const queryRef = useRef();

    const onSearchClick = async () => fetchTags(queryRef.current.value, 1);
    const onNewClick = async () => router.push('/admin-panel/tags/create');

    useEffect(() => {
        fetchTags('', 1);
    }, [fetchTags]);

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
            {hasMore && !isLoading && (
                <div className='self-center py-2'>
                    <Button
                        kind='ghost'
                        disabled={isLoading}
                        onClick={() => fetchTags(queryRef.current.value, page + 1)}
                    >
                        查看更多
                    </Button>
                </div>
            )}
        </Box>
    );
}
