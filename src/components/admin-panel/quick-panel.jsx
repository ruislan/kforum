'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import numberUtils from '@/lib/number-utils';

import Box from '../ui/box';
import Button from '../ui/button';
import { HeadingSmall } from '../ui/heading';

function ActionCleanupUploads() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
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
            <HeadingSmall tight>清理无效图片</HeadingSmall>
            <span className='text-xs text-gray-400'>无效图片指的是没有被头像、话题、帖子等使用的图片</span>
            <div className='flex'>
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    清理
                </Button>
            </div>
        </div>
    );
}

function ActionUpdateDiscussionHotness() {
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/discussions/hotness', {
                method: 'POST',
            });
            if (res.ok) {
                const json = await res.json();
                toast.success(`清零了 ${json.data.fade} 个话题的热度， 计算了 ${json.data.updated} 个话题的热度`);
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
            <HeadingSmall tight>更新话题热度</HeadingSmall>
            <span className='text-xs text-gray-400'>话题热度通过帖子的互动情况、参与人数、时间衰减等进行计算</span>
            <div className='flex'>
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    更新
                </Button>
            </div>
        </div>
    );

}

export default function QuickPanel() {
    return (
        <Box>
            <HeadingSmall>快捷操作</HeadingSmall>
            <div className='flex flex-col gap-4'>
                <ActionCleanupUploads />
                <ActionUpdateDiscussionHotness />
            </div>
        </Box>
    );
}