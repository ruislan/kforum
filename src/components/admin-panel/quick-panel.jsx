'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import numberUtils from '@/lib/number-utils';

import Box from '../ui/box';
import Button from '../ui/button';
import { HeadingSmall } from '../ui/heading';

function ActionCleanupUploads() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCleanupUploads = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/uploads/cleanup', {
                method: 'POST',
            });
            if (res.ok) {
                const json = await res.json();
                toast.success(`清理了 ${json.data.count} 张图片， 节约了 ${numberUtils.formatStorageUsage(json.data.size)}mb 空间`);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 401) {
                    toast.error('您的登录已过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            toast.error('未知错误，请稍后再试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-2'>
            <span className='text-xs text-gray-400'>无效图片指的是没有被头像、话题、帖子等使用的图片</span>
            <div className='flex'>
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={e => {
                        e.preventDefault();
                        handleCleanupUploads();
                    }}>
                    清理无效图片
                </Button>
            </div>
        </div>
    );
}

export default function QuickPanel() {
    return (
        <Box>
            <HeadingSmall>快捷操作</HeadingSmall>
            <div className='flex items-center flex-wrap'>
                <ActionCleanupUploads />
            </div>
        </Box>
    );
}