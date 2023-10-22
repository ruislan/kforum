'use client';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { signIn } from 'next-auth/react';
import Button from './ui/button';
import { Close } from './icons';

export default function SignInDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });
            if (res.ok) {
                setIsOpen(false);
                setUsername('');
                setPassword('');
            } else {
                console.log('Incorrect username or password');
            }
        } catch(err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)} className='cursor-pointer whitespace-nowrap transition-all text-neutral-400 hover:text-neutral-50 no-underline'>登陆</span>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-80" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-neutral-800 text-left align-middle shadow-xl transition-all">
                                    <div className='flex justify-end pt-4 pl-4 pr-4'>
                                        <Button size='sm' kind='ghost' shape='circle' onClick={() => setIsOpen(false)}>
                                            <Close />
                                        </Button>
                                    </div>
                                    <Dialog.Title className='text-xl font-bold pl-8 pr-8 mb-4'>用户登陆</Dialog.Title>
                                    <Dialog.Description className='text-sm pl-8 pr-8 mb-4'>
                                        欢迎回来，👏。继续，即表示您同意我们的用户协议，并承认您理解隐私政策。
                                    </Dialog.Description>
                                    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                                        <div className='flex flex-col gap-2 pl-8 pr-8 mb-8 w-full'>
                                            <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                                                <input type='text' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                                                    autoComplete='username' required
                                                    value={username} placeholder='邮箱或用户名' onChange={e => setUsername(e.target.value)} />
                                            </div>
                                            <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                                                <input type='password' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                                                    autoComplete='current-password' required
                                                    value={password} placeholder='密码' onChange={e => setPassword(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className='pl-8 pr-8 w-full mb-8'><Button className='w-full' type='submit' isLoading={isSubmitting}>登陆</Button></div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}