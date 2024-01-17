'use client';
import clsx from 'clsx';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';

import ActionButton from '../ui/action-button';
import { runIfFn } from '@/lib/fn';
import useLoginModal from '@/hooks/use-login-modal';
import useOutsideClick from '@/hooks/use-outside-click';
import { LoadingIcon, HeartIcon } from '../icons';

function ReactionItem({ reaction, post, isUserReacted, onReacted }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReacted, setIsReacted] = useState(isUserReacted);
    const handleReact = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const isReact = !isReacted;
            const res = await fetch(`/api/posts/${post.id}/reactions`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ id: reaction.id, isReact }),
                    headers: { 'Content-Type': 'application/json' }
                });
            if (res.ok) {
                setIsReacted(isReact);
                runIfFn(onReacted, { reaction, isReacted: isReact });
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 401) {
                    toast.error('您的登录已过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            toast.error('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <button className={clsx('flex justify-center items-center w-8 h-8',
            'text-base p-1 hover:bg-neutral-700 rounded',
            'cursor-pointer outline-none',
            isReacted && 'bg-neutral-700',
        )}
            onClick={e => {
                e.preventDefault();
                handleReact();
            }}
        >
            {isSubmitting ?
                <LoadingIcon className='w-4 h-4' /> :
                <Image width={18} height={18} src={reaction.icon} alt={reaction.name} />
            }
        </button>
    );
}

function ReactionList({ post, onReacted }) {
    const [isLoading, setIsLoading] = useState(true);
    const [reactions, setReactions] = useState([]);
    const [userReactions, setUserReactions] = useState([]);
    // 这里要获取两个数据，一个是reactions，一个是user已经在这个post上反馈过的ids
    // 已经反馈过的要进行选中处理，再次点击就是取消反馈
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/posts/${post.id}/reactions`);
                if (res.ok) {
                    const json = await res.json();
                    setReactions(json.data?.reactions);
                    setUserReactions(json.data?.userReactions);
                }
            } catch (_) {
            } finally {
                setIsLoading(false);
            }
        })();
    }, [post.id]);


    if (isLoading) return <span className='m-1 w-5 h-5'><LoadingIcon /></span>;
    return (
        <>
            {reactions?.map(r =>
                <ReactionItem
                    key={r.id}
                    reaction={r}
                    post={post}
                    isUserReacted={userReactions.some(ur => ur.reactionId === r.id)}
                    onReacted={onReacted}
                />
            )}
        </>
    );
}

export default function ActionReact({ post, onReacted }) {
    const ref = useRef();
    const { data } = useSession();
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);
    useOutsideClick(ref, () => setIsOpen(false));
    return (
        <div className='relative'>
            <ActionButton onClick={e => {
                e.preventDefault();
                if (!data?.user) loginModal.open()
                else setIsOpen(!isOpen);
            }} isActive={isOpen}>
                <HeartIcon />
            </ActionButton>
            <Transition
                as={Fragment}
                appear
                show={isOpen}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <div ref={ref} className={clsx('absolute bottom-full right-0 top-auto z-10',
                    'grid grid-cols-8 gap-1 p-1 mb-2 w-max',
                    'bg-clip-padding bg-neutral-800 border border-solid border-neutral-700 rounded-md shadow-xl')}>
                    <ReactionList post={post} onReacted={onReacted} />
                </div>
            </Transition>
        </div>
    );
}