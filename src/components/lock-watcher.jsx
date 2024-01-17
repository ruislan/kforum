'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import Button from './ui/button';
import { CloseIcon } from './icons';

export default function LockWatcher() {
    const { data } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!data?.user?.isLocked) return;
        (async () => {
            setIsOpen(true);
            await signOut({ redirect: false });
        })();
    }, [data?.user?.isLocked]);

    const handleClose = async () => {
        setIsOpen(false);
        router.push('/');
    };
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog className="relative z-50" onClose={handleClose}>
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
                                    <Button size='sm' kind='ghost' shape='circle' onClick={handleClose}>
                                        <CloseIcon />
                                    </Button>
                                </div>
                                <Dialog.Title className='text-2xl font-bold pl-8 pr-8 mb-4'>注意</Dialog.Title>
                                <Dialog.Description className='text-sm pl-8 pr-8 mb-4'>
                                    你已经被管理员封禁，如有疑问，请联系管理员。
                                </Dialog.Description>
                                <div className='flex justify-end px-8 mb-8 text-sm'>
                                    <Button onClick={handleClose}>去首页</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
