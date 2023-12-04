'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Box from '../ui/box';
import Button from '../ui/button';
import Tiptap from '../ui/tiptap';
import Select from '../ui/select';
import Input from '../ui/input';
import ActionTags from './action-tags';

export default function DiscussionCreator({ categories, initCategorySlug }) {
    const router = useRouter();
    const [categorySlug, setCategorySlug] = useState(initCategorySlug);
    const [title, setTitle] = useState('');
    const [contentText, setContentText] = useState('');
    const [contentJson, setContentJson] = useState('');
    const [tags, setTags] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const options = useMemo(() =>
        categories.map(c => ({
            value: c.slug,
            label: (
                <div className='flex items-center gap-2'>
                    <span className='w-4 h-4' style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                </div>
            )
        })),
        [categories]);

    const resetFields = () => {
        setCategorySlug('');
        setTitle('');
        setContentJson('');
        setContentText('');
        setError(null);
    };

    const validateFields = () => {
        setError(null);
        if (!categorySlug || categorySlug?.length < 1) {
            setError('请选择分类');
            return false;
        }
        if (title?.length < 1) {
            setError('请填写标题');
            return false;
        }

        if (contentText?.length < 1) {
            setError('请填写内容');
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
                body: JSON.stringify({
                    title,
                    content: JSON.stringify(contentJson),
                    text: contentText,
                    categorySlug,
                    tags: tags?.map(t => Number(t.id)).filter(Boolean)
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const json = await res.json();
                resetFields();
                toast.success('发布成功，正在跳转...');
                router.push(`/d/${json.data.id}`);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
                } else if (res.status === 401) {
                    setError('您的登录已过期，请重新登录');
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

    return (
        <Box>
            <form onSubmit={async e => { e.preventDefault(); handleSubmit(); }}>
                <div className='flex flex-col w-full gap-2'>
                    <Select
                        label='选择分类'
                        onChange={option => setCategorySlug(option.value)}
                        value={options.find(o => o.value === categorySlug)}
                        options={options}
                    />
                    <Input
                        type='text'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder='写一个不错的标题吧...'
                        required
                        maxLength={300}
                        minLength={2}
                        endEnhancer={
                            <span className='text-xs ml-2 text-gray-500'>
                                {title?.length || 0}/300
                            </span>
                        }
                    />
                    <Tiptap
                        kind='default'
                        content={''}
                        onUpdate={({ editor }) => {
                            setContentJson(editor.getJSON());
                            setContentText(editor.getText());
                        }}
                    />
                    <div className='flex items-center'>
                        <ActionTags onOk={tags => setTags([...tags])} />
                    </div>
                    {error && <span className='text-sm text-red-500'>{error}</span>}
                    <div className='flex justify-end'>
                        <Button
                            type='submit'
                            isLoading={isSubmitting}
                            disabled={
                                (!categorySlug && categorySlug?.length <= 0) ||
                                contentText?.length < 1 ||
                                title?.length < 1
                            }>
                            发布
                        </Button>
                    </div>
                </div>
            </form>
        </Box>
    );
}
