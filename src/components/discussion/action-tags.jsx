'use client';

import { useState } from 'react';
import TagsModal from './tags-modal';
import ActionButton from '../ui/action-button';
import useTagsModal from '@/hooks/use-tags-modal';
import { TagIcon } from '../icons';
import { runIfFn } from '@/lib/fn';
import toast from 'react-hot-toast';

// 选择标签，如果没有输入搜索，则加载最火的前 10 个标签，如果输入搜索直接加载前 10 个搜索结果
export default function ActionTags({ discussion, onSelected }) {
    const tagsModal = useTagsModal();
    const [isLoading, setIsLoading] = useState(false);

    const handleOnOk = async (selectedTags) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/discussions/${discussion.id}/tags`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ tags: selectedTags.map(t => t.id).filter(Boolean) }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                runIfFn(onSelected, selectedTags);
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
            toast.error('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <ActionButton onClick={e => {
                e.preventDefault();
                tagsModal.open();
            }}>
                <TagIcon />
            </ActionButton>
            <TagsModal onOk={handleOnOk} tags={discussion.tags} />
        </>
    );
}