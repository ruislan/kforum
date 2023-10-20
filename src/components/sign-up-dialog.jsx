'use client';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './ui/button';

export default function SignUpDialog() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <span onClick={() => setIsOpen(true)} className='cursor-pointer whitespace-nowrap transition-all text-neutral-400 hover:text-neutral-50 no-underline'>注册</span>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title>用户注册</Dialog.Title>
                                    <Dialog.Description>
                                        This will permanently deactivate your account
                                    </Dialog.Description>
                                    <p>
                                        Are you sure you want to deactivate your account? All of your data
                                        will be permanently removed. This action cannot be undone.
                                    </p>
                                    <Button className='w-full' onClick={() => setIsOpen(false)}>注册</Button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}