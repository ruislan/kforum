'use client';

import clsx from 'clsx';
import { Fragment, useEffect, useState } from 'react';
import Tag from '../ui/tag';
import { Dialog, Transition } from '@headlessui/react';
import { Close, TagIcon } from '../icons';
import Button from '../ui/button';
import Input from '../ui/input';
import toast from 'react-hot-toast';
import Spinner from '../ui/spinner';
import { runIfFn } from '@/lib/fn';

// 选择标签，如果没有输入搜索，则加载最火的前 10 个标签，如果输入搜索直接加载前 10 个搜索结果
export default function ActionTags({ tags: initTags = [], onOk }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([...initTags]);
    const [candidateTags, setCandidateTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');

    const handleClose = async () => {
        setIsOpen(false);
        setCandidateTags([]);
    };

    const handleOk = async () => {
        runIfFn(onOk, [...selectedTags]);
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen) return;
        if (isLoading) return;
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/tags?q=${query}&selected=${selectedTags.map(t => t.id).join(',')}`);
                if (res.ok) {
                    const json = await res.json();
                    setCandidateTags(json.data);
                }
            } catch (err) {
                toast.error('加载标签错误，请刷新重试');
            }
            setIsLoading(false);
        })();
    }, [isOpen, query]); // ignore warn here

    return (
        <>
            <div
                className={clsx(
                    'flex items-center gap-1 py-2 px-3 cursor-pointer rounded-md h-[46px]',
                    'focus:outline-none bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-400',
                    'text-sm text-gray-400 hover:text-gray-200',
                    'border border-solid border-neutral-700  focus-within:border-neutral-400'
                )}
                onClick={e => {
                    e.preventDefault();
                    setIsOpen(prev => !prev);
                }}
            >
                <span className='w-5 h-5'><TagIcon /></span>
                {
                    selectedTags?.length > 0 ?
                        <div className='flex items-center gap-1'>
                            {selectedTags.map((tag, index) => (
                                <Tag
                                    key={index}
                                    color={tag.textColor}
                                    bgColor={tag.bgColor}
                                >
                                    {tag.name}
                                </Tag>
                            ))}
                        </div> :
                        <span>添加标签</span>
                }
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                {/* center dialog */}
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
                                    <Dialog.Title className='text-2xl font-bold pl-8 pr-8 mb-4'>选择标签</Dialog.Title>
                                    <div className='text-sm pl-8 pr-8 mb-4 flex items-center flex-wrap gap-1'>
                                        {selectedTags.map((tag, index) => (
                                            <Tag
                                                key={index}
                                                color={tag.textColor}
                                                bgColor={tag.bgColor}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setCandidateTags(prev => [...prev, tag]);
                                                    setSelectedTags(prev => prev.filter(item => item.id !== tag.id));
                                                }}
                                            >
                                                {tag.name}
                                                <span className='inline-block align-bottom h-4 w-4'><Close /></span>
                                            </Tag>
                                        ))}
                                    </div>
                                    <div className='text-sm pl-8 pr-8 mb-4'>
                                        <Input
                                            type='text'
                                            value={query}
                                            onChange={e => setQuery(e.target.value)}
                                            placeholder='搜索标签...'
                                            endEnhancer={isLoading ? <Spinner tight size='sm' /> : null}
                                        />
                                    </div>
                                    <div className='text-sm pl-8 pr-8 mb-4 flex items-center flex-wrap gap-1'>
                                        {candidateTags?.map((tag, index) => (
                                            <Tag
                                                key={index}
                                                color={tag.textColor}
                                                bgColor={tag.bgColor}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setSelectedTags(prev => [...prev, tag]);
                                                    setCandidateTags(prev => prev.filter(item => item.id !== tag.id));
                                                }}
                                            >
                                                {tag.name}
                                            </Tag>
                                        ))}
                                    </div>
                                    <div className='flex gap-2 justify-end px-8 mb-8 text-sm'>
                                        <Button onClick={handleOk}>确定</Button>
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