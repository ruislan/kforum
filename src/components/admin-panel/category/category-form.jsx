'use client';

import { useState } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../ui/button';
import Input from '../../ui/input';
import FormControl from '../../ui/form-control';
import ConfirmModal from '../../ui/confirm-modal';
import { runIfFn } from '@/lib/fn';

function ActionDelete({ id, onError}) {
    const [isShow, setIsShow] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('删除成功');
                router.replace('/');
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    runIfFn(onError, json.message);
                } else if (res.status === 401) {
                    runIfFn(onError, '您的登录已过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            runIfFn(onError, '未知错误');
        } finally {
            setIsShow(false);
            setIsDeleting(false);
        }
    };

    if (!id) return null;
    return (
        <Button
            kind='outline'
            className='self-end'
            type='button'
            isLoading={isDeleting}
            disabled={isDeleting}
            onClick={(e) => {
                e.preventDefault();
                setIsShow(true);
            }}
        >
            删除
            <ConfirmModal
                show={isShow}
                title='确认删除'
                description='是否删除当前这个分类，如果分类下存在话题，则无法删除。'
                onCancel={() => setIsShow(false)}
                onClose={() => setIsShow(false)}
                onConfirm={() => handleDelete()}
            />
        </Button>
    );
}

export default function CategoryForm({ category }) {
    const [id, setId] = useState(category?.id);
    const [name, setName] = useState(category?.name || '');
    const [slug, setSlug] = useState(category?.slug || '');
    const [sequence, setSequence] = useState(category?.sequence || 0);
    const [description, setDescription] = useState(category?.description || '');
    const [color, setColor] = useState(category?.color || '#0088CC');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const validateFields = () => {
        setError(null);
        if (!name || name.length < 2 || name.length > 20) {
            setError('名称是必须的，不小于 2 个字符，不大于 20 个字符');
            return false;
        }
        if (!slug || slug.length < 2 || slug.length > 20 || !/^[a-z0-9]+$/.test(slug)) {
            setError('slug是必须的, 只能为小写或数字，不小于 2 个字符，不大于 20 个字符');
            return false;
        }
        if (sequence && (!Number(sequence) || Number(sequence) <= 0)) {
            setError('顺序只能大于等于 0 的数字');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        const res = await fetch('/api/admin/categories', {
            method: 'POST',
            body: JSON.stringify({ name, slug, sequence, description, color }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            setId(json.data);
            toast.success('创建成功');
            router.push(`/admin-panel/category?slug=${slug}`);
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
    };

    const handleUpdate = async () => {
        const res = await fetch(`/api/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id, name, slug, sequence, description, color }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            toast.success('更新成功');
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
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateFields()) return;
        setIsSubmitting(true);
        try {
            const isUpdate = _.isNumber(id);
            isUpdate ? await handleUpdate() : await handleCreate();
        } catch (err) {
            setError('未知错误，请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={e => { e.preventDefault(); handleSubmit(); }}
            className='flex flex-col gap-4 text-gray-100'
        >
            <FormControl title='名称' subtitle='应该尽量简洁'>
                <Input
                    value={name}
                    minLength={2}
                    maxLength={20}
                    onChange={e => setName(e.target.value)}
                />
            </FormControl>
            <FormControl title='slug' subtitle='用于 URL ，只支持小写英文字符和数字'>
                <Input
                    value={slug}
                    minLength={2}
                    maxLength={20}
                    onChange={e => setSlug(e.target.value)}
                />
            </FormControl>
            <FormControl title='颜色' subtitle='(可选) 16进制颜色值, 例如：#0088CC'>
                <Input
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    endEnhancer={<span className='w-4 h-4 rounded' style={{ backgroundColor: color }}></span>}
                />
            </FormControl>
            <FormControl title='顺序' subtitle='(可选) 数字越小越靠前'>
                <Input
                    min={0}
                    max={65535}
                    type='number'
                    value={sequence}
                    onChange={e => setSequence(e.target.value)}
                />
            </FormControl>
            <FormControl title='描述' subtitle='(可选) 一段话简介分类'>
                <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </FormControl>
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div className='flex items-center justify-between'>
                <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting}>{id ? '更新' : '新建'}</Button>
                <ActionDelete id={id} onError={(message) => setError(message)} />
            </div>
        </form>
    );
}