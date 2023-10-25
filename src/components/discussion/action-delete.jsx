'use client';
import { useState } from 'react';

import { runIfFn } from '@/lib/fn';

import { DeleteBin, LoadingIcon } from '../icons';
import ActionButton from '../ui/action-button';
import ConfirmModal from '../ui/confirm-modal';
import toast from 'react-hot-toast';

export default function ActionDelete({ post, onDeleted, confirmContent = '你确定要删除这篇内容吗？' }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('删除成功');
                runIfFn(onDeleted);
                setIsOpenDeleteConfirm(false);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 401) {
                    toast.error('您的登录以过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            toast.error('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsDeleting(false);
        }
    }
    return (
        <ActionButton onClick={e => {
            e.preventDefault();
            setIsOpenDeleteConfirm(true);
        }}>
            {isDeleting ? <LoadingIcon /> : <DeleteBin />}
            <ConfirmModal title='删除确认' description={confirmContent}
                show={isOpenDeleteConfirm} onConfirm={() => handleDelete()}
                onCancel={() => setIsOpenDeleteConfirm(false)}
                onClose={() => setIsOpenDeleteConfirm(false)} />
        </ActionButton>
    );
}