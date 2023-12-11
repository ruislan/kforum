'use client';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import useRegisterModal from '@/hooks/use-register-modal';

import Button from '../ui/button';
import { Close } from '../icons';
import useLoginModal from '@/hooks/use-login-modal';

export default function RegisterModal() {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = async () => {
        if (isSubmitting) return;
        registerModal.close();
        resetFields();
    }

    const resetFields = () => {
        setName('');
        setPassword('');
        setEmail('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, name, password, }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                registerModal.close();
                resetFields();
                loginModal.open();
                toast.success('您已经成功注册，请登录吧。');
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
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
        <Transition appear show={registerModal.isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={handleClose}>
                <Transition.Child as={Fragment}
                    enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100'
                    leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/60' />
                </Transition.Child>
                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child as={Fragment}
                            enter='ease-out duration-300' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-neutral-800 text-left align-middle shadow-xl transition-all'>
                                <div className='flex justify-end pt-4 pl-4 pr-4'>
                                    <Button size='sm' kind='ghost' shape='circle' onClick={handleClose}>
                                        <Close />
                                    </Button>
                                </div>
                                <Dialog.Title className='text-2xl font-bold pl-8 pr-8 mb-4'>注册</Dialog.Title>
                                <Dialog.Description className='text-sm pl-8 pr-8 mb-4'>
                                    欢迎加入👏。继续注册，即表示您同意我们的用户协议，并承认您理解隐私政策。
                                </Dialog.Description>
                                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                                    <div className='flex flex-col gap-2 pl-8 pr-8 mb-4 w-full'>
                                        <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                                            <input type='email' placeholder='邮箱' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                                                autoComplete='email' required value={email} onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                                            <input type='text' placeholder='用户名' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                                                autoComplete='username' required value={name} onChange={e => setName(e.target.value)} />
                                        </div>
                                        <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                                            <input type='password' placeholder='密码' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                                                autoComplete='current-password' required value={password} onChange={e => setPassword(e.target.value)} />
                                        </div>
                                        {error && <span className='text-sm text-red-500'>{error}</span>}
                                    </div>
                                    <div className='pl-8 pr-8 w-full mb-4'><Button className='w-full' type='submit' disabled={isSubmitting} isLoading={isSubmitting}>注册</Button></div>
                                </form>
                                <div className='px-8 mb-8 text-sm'>
                                    <span className='mr-1'>已经有账户了?</span>
                                    <span className='underline underline-offset-2 cursor-pointer'
                                        onClick={e => {
                                            e.preventDefault();
                                            handleClose();
                                            loginModal.open();
                                        }}>登录</span>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}