'use client';

import { useRef, useState } from 'react';

import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';
import Tiptap, { toHTML } from '../ui/tiptap';
import Button from '../ui/button';

export default function PostUpdater({ post, onUpdated, onCanceled }) {
    const { data: session } = useSession();
    const [contentText, setContentText] = useState(post?.text);
    const [contentJson, setContentJson] = useState(post?.content);
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
        if (contentText?.length < 1) {
            setError('你还没准备好，请填写内容');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
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
                    setError('您的登录以过期，请重新登录');
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

    if (!session || !post) return null;
    return (
        <form className='my-2' ref={formRef} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
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
                    <Button size='sm' type='submit' isLoading={isSubmitting} disabled={contentText?.length <= 0}>
                        更新
                    </Button>
                </div>
            </div>
        </form>
    );
}