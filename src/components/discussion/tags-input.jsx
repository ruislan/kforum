'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Tag from '../ui/tag';
import { TagIcon } from '../icons';
import { runIfFn } from '@/lib/fn';
import TagsModal from './tags-modal';
import useTagsModal from '@/hooks/use-tags-modal';

// 选择标签，如果没有输入搜索，则加载最火的前 10 个标签，如果输入搜索直接加载前 10 个搜索结果
export default function TagsInput({ onSelected }) {
    const tagsModal = useTagsModal();
    const [selectedTags, setSelectedTags] = useState([]);
    const handleOnOk = async (selectedTags) => {
        setSelectedTags(selectedTags);
        runIfFn(onSelected, selectedTags);
    };
    return (
        <>
            <div
                className={clsx(
                    'flex items-center gap-1 py-2 px-3 cursor-pointer rounded-md h-[46px]',
                    'focus:outline-none bg-neutral-800 text-sm text-gray-400',
                    'border border-solid border-neutral-700  focus-within:border-neutral-400'
                )}
                onClick={e => {
                    e.preventDefault();
                    tagsModal.open();
                }}
            >
                <span className='w-4 h-4 mr-2'><TagIcon /></span>
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
            <TagsModal onOk={handleOnOk} tags={selectedTags} />
        </>
    );
}
