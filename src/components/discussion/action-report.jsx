'use client';
import { Fragment, useState } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';

import useLoginModal from '@/hooks/use-login-modal';

import { CheckIcon, CloseIcon, FlagIcon } from '../icons';
import ActionButton from '../ui/action-button';
import Button from '../ui/button';
import Textarea from '../ui/textarea';
import { REPORT_TYPES } from '@/lib/constants';

export default function ActionReport({ post }) {
    const [show, setShow] = useState(false);
    const loginModal = useLoginModal();
    const { data } = useSession();

    const [type, setType] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetFields = () => {
        setType('');
        setReason('');
        setError(null);
    }

    const validateFields = () => {
        setError(null);
        if (_.isEmpty(type)) {
            setError('请至少选择一个举报');
            return false;
        }
        if (type === 'other' && reason.length < 4) {
            setError('请说明举报的原因，至少 4 个字');
            return false;
        }
        return true;
    };

    const handleClick = async () => {
        if (!data?.user) loginModal.open();
        setShow(true);
    };

    const handleTypeChanged = async (type) => {
        setType(type);
        setError('');
    };

    const handleClose = async () => {
        resetFields();
        setShow(false);
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`/api/posts/${post.id}/reports`, {
                method: 'POST',
                body: JSON.stringify({ type, reason }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                resetFields();
                setShow(false);
                toast.success('再次感谢您，这将会帮助我们做得更好');
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
            setError('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!post) return null;

    return (
        <>
            <ActionButton onClick={e => {
                e.preventDefault();
                handleClick();
            }}>
                <FlagIcon />
            </ActionButton>
            <Transition appear show={show} as={Fragment}>
                <Dialog as='div' className='relative z-50' onClose={handleClose}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/60' aria-hidden='true' />
                    </Transition.Child>
                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-full items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-neutral-800 text-left align-middle shadow-xl transition-all'>
                                    <div className='flex justify-end pt-4 pl-4 pr-4'>
                                        <Button size='sm' kind='ghost' shape='circle' onClick={handleClose}>
                                            <CloseIcon />
                                        </Button>
                                    </div>
                                    <Dialog.Title as='h3' className='text-2xl font-bold pl-8 pr-8 mb-4'>举报</Dialog.Title>
                                    <Dialog.Description className='flex flex-col text-sm pl-8 pr-8 mb-4'>
                                        感谢您帮助我们建设文明健康的社区，您的每一分付出，我们都看得到。
                                    </Dialog.Description>
                                    <div className='flex flex-col gap-2 pl-8 pr-8 mb-4 w-full'>
                                        {REPORT_TYPES.map((option, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleTypeChanged(option.value)}
                                                className={clsx(
                                                    'flex items-center justify-between p-2 rounded-md cursor-pointer',
                                                    'border border-solid border-neutral-700 hover:bg-neutral-700/70',
                                                    option.value === type ? 'bg-neutral-700/70' : 'bg-neutral-800'
                                                )}
                                            >
                                                <div className='flex flex-col gap-1'>
                                                    <h3 className='text-sm dark:text-gray-200 font-medium'>{option.name}</h3>
                                                    <p className='text-xs dark:text-gray-400'>{option.description}</p>
                                                </div>
                                                {option.value === type && (
                                                    <div className='text-gray-200 rounded-full bg-neutral-600 p-1 shadow'>
                                                        <CheckIcon className='w-4 h-4' />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {type === 'other' && (
                                            <div className='flex flex-col gap-1'>
                                                <Textarea
                                                    maxLength={200}
                                                    onChange={e => setReason(e.target.value)}
                                                    value={reason}
                                                    placeholder='请说明您举报的原因，至少 4 个字。'
                                                />
                                            </div>
                                        )}
                                        {error && <span className='text-sm text-red-500'>{error}</span>}
                                    </div>
                                    <div className='flex gap-2 justify-end px-8 mb-8 text-sm'>
                                        <Button kind='outline' onClick={handleClose}>取消</Button>
                                        <Button
                                            disabled={
                                                _.isEmpty(type) ||
                                                (type === 'other' && reason.length < 4) ||
                                                isSubmitting
                                            }
                                            isLoading={isSubmitting}
                                            onClick={handleSubmit}
                                        >
                                            确定
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}