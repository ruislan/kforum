'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Box from '../ui/box';
import Button from '../ui/button';
import Tiptap from '../ui/tiptap';

// 点击弹出搜索层，然后进行搜索，不用单独页面
export default function DiscussionCreator({ categories, initCategorySlug }) {
    const router = useRouter();
    const [categorySlug, setCategorySlug] = useState(initCategorySlug);
    const [title, setTitle] = useState('');
    const [contentText, setContentText] = useState('');
    const [contentJson, setContentJson] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const resetFields = () => {
        setCategorySlug('');
        setTitle('');
        setContentJson('');
        setContentText('');
        setError(null);
    };

    const validateFields = () => {
        setError(null);
        if (categorySlug?.length < 1) {
            setError('还没准备好，请选择分类');
            return false;
        }
        if (title?.length < 1) {
            setError('还没准备好，请填写标题');
            return false;
        }

        if (contentText?.length < 1) {
            setError('还没准备好，请填写内容');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateFields()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/discussions', {
                method: 'POST',
                body: JSON.stringify({ title, content: JSON.stringify(contentJson), categorySlug }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                resetFields();
                toast.success('发布成功');
                router.push(`/c/${categorySlug}`);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            console.log(err);
            setError('未知错误，请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            <form onSubmit={async e => { e.preventDefault(); handleSubmit(); }}>
                <div className='flex flex-col w-full gap-2'>
                    <div className='text-sm focus:outline-none bg-neutral-800 p-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                        <select required className='w-full text-neutral-200 bg-transparent outline-none'
                            onChange={e => setCategorySlug(e.target.value)} value={categorySlug}
                        >
                            <option value={null}>选择分类</option>
                            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className='flex items-center text-sm focus:outline-none bg-neutral-800 p-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                        <input type='text' value={title} onChange={e => setTitle(e.target.value)}
                            maxLength={300} minLength={2} required
                            placeholder='起一个不错的标题吧...'
                            className='w-full text-neutral-200 bg-transparent outline-none' />
                        <span className='text-xs ml-2 text-neutral-500'>{title?.length || 0}/300</span>
                    </div>
                    <Tiptap kind='default' content={''} onUpdate={({ editor }) => {
                        setContentJson(editor.getJSON());
                        setContentText(editor.getText());
                    }} />
                    {error && <span className='text-sm text-red-500'>{error}</span>}
                    <div className='flex justify-end'>
                        <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting}>发布</Button>
                    </div>
                </div>
            </form>
        </Box>
    );
}
