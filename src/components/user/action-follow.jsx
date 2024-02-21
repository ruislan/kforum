'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Button from '../ui/button';
import { LoadingIcon, PlusIcon, SubtractIcon } from '../icons';
import useLoginModal from '@/hooks/use-login-modal';
import toast from 'react-hot-toast';
import { runIfFn } from '@/lib/fn';

export default function ActionFollow({ user, onFollowed }) {
    const { data } = useSession();
    const loginModal = useLoginModal();

    const [isLoading, setIsLoading] = useState(false);
    const [isFollowed, setIsFollowed] = useState(user?.isFollowed);

    const handleAction = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const newState = !isFollowed;
            let res = null;
            if (isFollowed) {
                res = await fetch(`/api/users/${user.name}/follow`, { method: 'DELETE' });
            } else {
                res = await fetch(`/api/users/${user.name}/follow`, { method: 'POST' });
            }
            if (res?.ok) {
                toast.success(newState ? '已经关注' : '已经取消关注');
                setIsFollowed(newState);
                runIfFn(onFollowed, newState);
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 403) {
                    toast.error('您没有权限进行此操作');
                } else if (res.status === 401) {
                    toast.error('您的登录已过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            toast.error('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsLoading(false);
        }
    }

    if (!user || user?.id === data?.user?.id) return null;

    return (
        <Button
            size='sm'
            kind={isFollowed ? 'outline' : 'default'}
            onClick={e => {
                e.preventDefault();
                if (!data?.user) loginModal.open();
                else handleAction();
            }}
        >
            <span className='w-4 h-4 mr-1'>
                {isLoading ?
                    <LoadingIcon />
                    :
                    (isFollowed ? <SubtractIcon /> : <PlusIcon />)
                }
            </span>
            <span>{isFollowed ? '取消关注' : '关注'}</span>
        </Button>
    );
}
