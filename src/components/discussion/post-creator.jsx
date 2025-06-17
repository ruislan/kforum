'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';
import Box from '../ui/box';
import { ArrowRightIcon } from '../icons';
import Tiptap from '../ui/tiptap';
import Button from '../ui/button';
import PostDetailPopover from './post-detail-popover';
import UserAvatar from '../ui/user-avatar';
import { MIN_LENGTH_CONTENT } from '@/lib/constants';
import UserFancyLink from '../user/user-fancy-link';

export default function PostCreator({ discussion, replyToPost, onCreated }) {
    const { data: session } = useSession();
    const [contentText, setContentText] = useState('');
    const [contentJson, setContentJson] = useState({});
    const [hasImage, setHasImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [tiptap, setTipTap] = useState(null);
    const formRef = useRef(null);

    const resetFields = () => {
        setContentJson('');
        setContentText('');
        setError(null);
    };

    const validateFields = () => {
        setError(null);
        if (!hasImage && contentText?.length < MIN_LENGTH_CONTENT) {
            setError(`内容应该不小于 ${MIN_LENGTH_CONTENT} 个字符`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateFields()) return;
        setIsSubmitting(true);
        try {
            const body = { discussionId: discussion.id, content: JSON.stringify(contentJson), text: contentText };
            if (replyToPost && !replyToPost.isFirst) body.postId = replyToPost.id;
            const res = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({ ...body }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const json = await res.json();
                resetFields();
                tiptap?.chain().focus().clearContent().run();
                toast.success('回复成功');
                runIfFn(onCreated, { post: json.data });
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
                } else if (res.status === 401) {
                    setError('您的登录已过期，请重新登录');
                } else if (res.status === 403) {
                    toast.error('您没有权限进行此操作');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            setError('未知错误，请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!tiptap || !replyToPost) return;
        if (!!replyToPost.focus && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            tiptap.commands.focus('start', { scrollIntoView: false });
        }
    }, [replyToPost, tiptap]);

    useEffect(() => {
        if (!contentJson) return;
        const has = contentJson.content?.some(node => node.type === 'image');
        setHasImage(has);
    }, [contentJson]);

    if (!session || !discussion) return null;

    return (
        <Box className='flex flex-col'>
            <div className='flex mb-3'>
                <div>
                    <UserAvatar
                        className='mr-1.5'
                        name={session.user?.name}
                        avatar={session.user?.avatarUrl}
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex items-center mb-1.5 text-xs text-gray-300'>
                        <span className='text-xs'>u/{session.user?.name}</span>
                        <span className='w-4 h-4'><ArrowRightIcon /></span>
                        <div className='flex items-center text-gray-100'>
                            <span className='whitespace-nowrap'>回贴&nbsp;</span>
                            {!replyToPost || replyToPost?.isFirst ? '主贴' : <PostDetailPopover post={replyToPost} />}
                        </div>
                    </div>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <Tiptap onCreate={({ editor }) => setTipTap(editor)} onUpdate={({ editor }) => {
                            setContentJson(editor.getJSON());
                            setContentText(editor.getText());
                        }}
                            endActionEnhancer={
                                <div className='flex items-center ml-2'>
                                    <Button
                                        size='sm'
                                        type='submit'
                                        isLoading={isSubmitting}
                                        disabled={!hasImage && contentText?.length < MIN_LENGTH_CONTENT}
                                    >
                                        回复
                                    </Button>
                                </div>
                            }
                        />
                        {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}
                    </form>
                </div>
            </div>
        </Box>
    );
}
