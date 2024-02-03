'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { LinkIcon, LoadingIcon } from '../icons';
import ActionButton from '../ui/action-button';

export default function ActionCopyLink({ post }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCopyLink = async () => {
        if (isLoading) return;
        setIsLoading(true);
        let url = location.href;
        if (post) url += `/p/${post.id}`;
        if (!!navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            toast.success('已经拷贝分享链接');
        } else {
            toast.error('无法分享，请检查你的浏览器安全策略');
        }
        setIsLoading(false);
    }
    return (
        <ActionButton onClick={e => {
            e.preventDefault();
            handleCopyLink();
        }}>
            {isLoading ? <LoadingIcon /> : <LinkIcon />}
        </ActionButton>
    );
}
