'use client';
import _ from 'lodash';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Box from '@/components/ui/box';
import FormControl from '@/components/ui/form-control';
import { HeadingSmall } from '@/components/ui/heading';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Tag from '@/components/ui/tag';
import ConfirmModal from '@/components/ui/confirm-modal';

function ActionDelete({ id, onError }) {
    const [isShow, setIsShow] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/tags/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('删除成功');
                router.replace('/admin-panel/tags');
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
                description='是否删除当前这个标签，这将会让所有使用该标签的话题都失去该标签。'
                onCancel={() => setIsShow(false)}
                onClose={() => setIsShow(false)}
                onConfirm={() => handleDelete()}
            />
        </Button>
    );
}


export default function TagForm({ tag }) {
    const router = useRouter();

    const [id, setId] = useState(tag?.id);
    const [name, setName] = useState(tag?.name || '');
    const [textColor, setTextColor] = useState(tag?.textColor || '');
    const [bgColor, setBgColor] = useState(tag?.bgColor || '');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const validateFields = () => {
        setError(null);
        if (!name || name.length < 2 || name.length > 20) {
            setError('名称是必须的，不小于 2 个字符，不大于 20 个字符');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        const res = await fetch('/api/admin/tags', {
            method: 'POST',
            body: JSON.stringify({ name, textColor, bgColor }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            setId(json.data);
            toast.success('创建成功');
            router.push(`/admin-panel/tags/${json.data}`);
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
        const res = await fetch(`/api/admin/tags/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id, name, textColor, bgColor }),
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
        <Box className='flex flex-col'>
            <div className='flex items-center justify-between mb-3'>
                <HeadingSmall tight>{id ? '编辑标签' : '新增标签'}</HeadingSmall>
                <Link
                    className='ml-2 text-sm text-gray-500 hover:text-gray-400'
                    href='/admin-panel/tags'
                >
                    返回列表
                </Link>
            </div>
            <div className='mb-3'>
                <Tag color={textColor} bgColor={bgColor}>{name || '范例标签'}</Tag>
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className='flex flex-col gap-4 text-gray-100'
            >
                <FormControl title='名称' subtitle='应该尽量简洁，最长 20 个字符'>
                    <Input
                        value={name}
                        minLength={2}
                        maxLength={20}
                        onChange={e => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl title='文字颜色' subtitle='(可选) 16进制颜色值, 例如：#0088CC。或 RGB/RGBA 颜色值，例如：rgb(255,255,255)'>
                    <Input
                        value={textColor}
                        onChange={e => setTextColor(e.target.value)}
                    />
                </FormControl>
                <FormControl title='背景颜色' subtitle='(可选) 16进制颜色值, 例如：#0088CC。或 RGB/RGBA 颜色值，例如：rgb(255,255,255)'>
                    <Input
                        value={bgColor}
                        onChange={e => setBgColor(e.target.value)}
                    />
                </FormControl>
                {error && <span className='text-sm text-red-500'>{error}</span>}
                <div className='flex items-center justify-between'>
                    <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting}>{id ? '更新' : '新建'}</Button>
                    <ActionDelete id={id} onError={(message) => setError(message)} />
                </div>
            </form>
        </Box>
    );
}