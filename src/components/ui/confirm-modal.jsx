'use client';

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import Button from "./button";
import { Close } from "../icons";
import { runIfFn } from '@/lib/fn';

export default function ConfirmModal({ show, title, description, onClose, onCancel, onConfirm }) {
    const handleClose = () => {
        if (!show) return;
        runIfFn(onClose);
    };
    const handleCancel = () => {
        if (!show) return;
        runIfFn(onCancel);
    };
    const handleConfirm = () => {
        if (!show) return;
        runIfFn(onConfirm);
    }
    return (
        <Transition appear show={show} as={Fragment}>
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
                                        <Close />
                                    </Button>
                                </div>
                                <Dialog.Title className='text-2xl font-bold pl-8 pr-8 mb-4'>{title}</Dialog.Title>
                                <Dialog.Description className='text-sm pl-8 pr-8 mb-4'>{description}</Dialog.Description>
                                <div className='flex gap-2 justify-end px-8 mb-8 text-sm'>
                                    <Button kind='outline' onClick={handleCancel}>取消</Button>
                                    <Button onClick={handleConfirm}>确定</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}