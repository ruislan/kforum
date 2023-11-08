'use client';

import { useCallback, useEffect, useState } from 'react';

import Box from '../ui/box';
import Stats from '../ui/stats';
import Spinner from '../ui/spinner';
import { Refresh } from '../icons';
import { HeadingSmall } from '../ui/heading';

export default function Statistics() {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            const json = await res.json();
            setStats(json.data);
        } catch (err) {
            setError('获取数据失败');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <Box className='flex flex-col'>
            <div className='flex items-center text-gray-400 gap-2 mb-3'>
                <HeadingSmall tight>数据统计</HeadingSmall>
                <span className='w-4 h-4 cursor-pointer' onClick={e => {
                    e.preventDefault();
                    if (isLoading) return;
                    fetchStats();
                }}>
                    <Refresh />
                </span>
            </div>
            <div className='flex items-center flex-wrap gap-4'>
                {isLoading ?
                    <Spinner size='sm' tight /> :
                    <>
                        <Stats name='管理员' value={stats.admins || '-'} />
                        <Stats name='用户' value={stats.users || '-'} />
                        <Stats name='话题' value={stats.discussions || '-'} />
                        <Stats name='帖子' value={stats.posts || '-'} />
                        <Stats name='反馈' value={stats.reactions || '-'} />
                    </>
                }
            </div>
            {error && <span className='mt-2 text-sm text-red-500'>{error}</span>}
        </Box>
    );
}