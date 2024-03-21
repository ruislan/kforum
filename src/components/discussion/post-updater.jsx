'use client';


import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { runIfFn } from '@/lib/fn';
import { MIN_LENGTH_CONTENT } from '@/lib/constants';
import Tiptap, { toHTML } from '../ui/tiptap';
import Button from '../ui/button';

export default function PostUpdater({ post, onUpdated, onCanceled }) {
    const { data: session } = useSession();
    const [contentText, setContentText] = useState(post?.text);
    const [contentJson, setContentJson] = useState(JSON.parse(post?.content || '{}'));
    const [hasImage, setHasImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [tiptap, setTipTap] = useState(null);
    const formRef = useRef(null);

    const resetFields = () => {
        setContentJson(post?.content);
        setContentText(post?.text);
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

    const handleSubmit = async () => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateFields()) return;
        setIsSubmitting(true);
        try {
            const body = { content: JSON.stringify(contentJson), text: contentText };
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...body }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                resetFields();
                tiptap?.chain().focus().clearContent().run();
                toast.success('修改成功');
                runIfFn(onUpdated, body);
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
        if (!contentJson) return;
        const has = contentJson.content?.some(node => node.type === 'image');
        setHasImage(has);
    }, [contentJson]);

    if (!session || !post) return null;
    return (
        <form className='my-2' ref={formRef} onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <Tiptap
                    content={toHTML(contentJson)}
                    onCreate={({ editor }) => setTipTap(editor)}
                    onUpdate={({ editor }) => {
                        setContentJson(editor.getJSON());
                        setContentText(editor.getText());
                    }} />
                {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}
                <div className='flex items-center gap-2 justify-end'>
                    <Button size='sm' kind='outline' type='button' disabled={isSubmitting} onClick={e => {
                        e.preventDefault();
                        runIfFn(onCanceled);
                    }}>
                        取消
                    </Button>
                    <Button
                        size='sm'
                        type='submit'
                        isLoading={isSubmitting}
                        disabled={!hasImage && contentText?.length < MIN_LENGTH_CONTENT}
                    >
                        更新
                    </Button>
                </div>
            </div>
        </form>
    );
}
