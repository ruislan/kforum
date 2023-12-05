'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import { runIfFn } from '@/lib/fn';
import useTagsModal from '@/hooks/useTagsModal';
import Tag from '../ui/tag';
import { Close } from '../icons';
import Button from '../ui/button';
import Input from '../ui/input';
import Spinner from '../ui/spinner';

// 选择标签，如果没有输入搜索，则加载最火的前 10 个标签，如果输入搜索直接加载前 10 个搜索结果
export default function TagsModal({ tags, limit = 5, onOk, onCancel }) {
    const tagsModal = useTagsModal();
    const [selectedTags, setSelectedTags] = useState([...tags]);
    const [candidateTags, setCandidateTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');

    const handleClose = async () => {
        runIfFn(onCancel);
        tagsModal.close();
        setCandidateTags([]);
    };

    const handleOk = async () => {
        runIfFn(onOk, [...selectedTags]);
        tagsModal.close();
        setCandidateTags([]);
    };

    useEffect(() => {
        if (!tagsModal.isOpen) return;
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
    }, [tagsModal.isOpen, query]); // ignore warn here

    return (
        <Transition appear show={tagsModal.isOpen} as={Fragment}>
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
                                        disabled={selectedTags.length >= limit}
                                        placeholder={selectedTags.length < limit ? '搜索标签...' : `最多只能选择 ${limit} 个标签`}
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
                                                if (selectedTags.length >= limit) return;
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
    );
}