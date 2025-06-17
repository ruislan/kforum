'use client';

import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Box from '../ui/box';
import Button from '../ui/button';
import Tiptap from '../ui/tiptap';
import Select from '../ui/select';
import Input from '../ui/input';
import TagsInput from './tags-input';
import { MIN_LENGTH_CONTENT, MIN_LENGTH_TITLE } from '@/lib/constants';

export default function DiscussionCreator({ categories, initCategorySlug }) {
    const router = useRouter();
    const [categorySlug, setCategorySlug] = useState(initCategorySlug);
    const [title, setTitle] = useState('');
    const [contentText, setContentText] = useState('');
    const [contentJson, setContentJson] = useState({});
    const [hasImage, setHasImage] = useState(false);
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
        setContentText('');
        setContentJson({});
        setTags([]);
        setHasImage(false);
        setError(null);
    };

    const validateFields = () => {
        setError(null);
        if (_.isEmpty(categorySlug)) {
            setError('请选择分类');
            return false;
        }
        if (title?.length < MIN_LENGTH_TITLE) {
            setError(`标题应该不小于 ${MIN_LENGTH_TITLE} 个字符`);
            return false;
        }
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

    return (
        <Box>
            <form onSubmit={handleSubmit}>
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
                    <TagsInput onSelected={tags => setTags([...tags])} />
                    {error && <span className='text-sm text-red-500'>{error}</span>}
                    <div className='flex justify-end'>
                        <Button
                            type='submit'
                            isLoading={isSubmitting}
                            disabled={
                                (_.isEmpty(categorySlug)) ||
                                !hasImage && contentText?.length < 2 ||
                                title?.length < 2
                            }>
                            发布
                        </Button>
                    </div>
                </div>
            </form>
        </Box>
    );
}
