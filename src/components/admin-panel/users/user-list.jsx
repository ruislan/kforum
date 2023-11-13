'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import Box from '../../ui/box';
import Button from '../../ui/button';
import { HeadingSmall } from '../../ui/heading';
import Spinner from '../../ui/spinner';
import Link from 'next/link';
import UserAvatar from '../../ui/user-avatar';
import Input from '../../ui/input';
import { Locked } from '../../icons';
import SplitBall from '../../ui/split-ball';
import ActionLock from './action-lock';
import toast from 'react-hot-toast';
import NoContent from '@/components/ui/no-content';


export default function UserList() {
    const [isLoading, setIsLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const queryRef = useRef();

    const handleLockClick = async (userId, lockState) => {
        setDataList(prev => {
            const u = prev.find(u => u.id === userId);
            u.isLocked = lockState;
            return [...prev];
        })
    }

    const fetchDataList = useCallback(async () => {
        setIsLoading(true);
        try {
            let url = `/api/admin/users?page=${page}`;
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

    const doSearch = async () => {
        setDataList([]);
        page > 1 ? setPage(1) : fetchDataList();
    };

    useEffect(() => {
        fetchDataList();
    }, [fetchDataList]);

    return (
        <Box className='flex flex-col'>
            <HeadingSmall>用户列表</HeadingSmall>
            <div className='flex items-center gap-2 mb-3'>
                <Input
                    ref={queryRef}
                    placeholder='ID、用户名或邮箱'
                    onKeyUp={e => {
                        if (e.key === 'Enter') doSearch();
                    }}
                />
                <Button onClick={e => {
                    e.preventDefault();
                    doSearch();
                }}>
                    搜索
                </Button>
            </div>
            <div className='flex flex-col px-0.5 gap-2'>
                {dataList.map((user, index) => (
                    <div
                        key={index}
                        className={clsx(
                            'flex flex-col pb-2 border-b border-b-neutral-700',
                            'last:pb-0 last:border-none '
                        )}
                    >
                        <div className='flex items-center my-2'>
                            <UserAvatar
                                className='mr-1.5'
                                name={user.name}
                                avatar={user.avatarUrl}
                            />
                            <div className='flex flex-col'>
                                <div className='flex items-center'>
                                    <Link
                                        href={`/u/${user.name}`}
                                        onClick={e => e.stopPropagation()}
                                        className='text-sm hover:underline underline-offset-2 cursor-pointer'>
                                        u/{user.name}
                                    </Link>
                                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                                    <span className='text-sm text-gray-200'>{user.email}</span>
                                    {user.isLocked && (<span className='h-3.5 w-3.5 ml-1.5 text-yellow-400'><Locked /></span>)}
                                </div>
                                <span className='text-xs text-gray-400'>
                                    注册于 {new Date(user.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center text-gray-300 gap-2'>
                            {!user.isAdmin && <ActionLock user={user} onLocked={(lockState) => handleLockClick(user.id, lockState)} />}
                        </div>
                    </div>
                ))}
                {!isLoading && dataList.length === 0 && <NoContent noWrap text='没有数据' />}
            </div>
            {isLoading && <Spinner />}
            {hasMore && (
                <div className='self-center py-2'>
                    <Button kind='ghost' disabled={isLoading} onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </Box>
    );
}