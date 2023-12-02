'use client';

import clsx from "clsx";
import { Fragment, useState } from "react";
import Tag from "../ui/tag";
import { Transition } from "@headlessui/react";

export default function InputTags({
    tags: initTags = [],
    placeHolder,
}) {
    const [tags, setTags] = useState([...initTags]);
    const [open, setOpen] = useState(false);

    return (
        <div
            className={clsx(
                'flex items-center text-sm w-full py-2 px-3 cursor-pointer h-[46px]',
                'relative text-sm text-gray-50',
                'focus:outline-none bg-neutral-800 rounded-md',
                'border border-solid border-neutral-700  focus-within:border-neutral-400'
            )}
            onClick={e => {
                e.preventDefault();
                setOpen(prev => !prev);
            }}
        >
            {placeHolder && tags.length === 0 && (<span className='text-gray-400 flex-1'>{placeHolder}</span>)}
            {tags.length > 0 && (
                <div className='flex items-center gap-1 flex-1'>
                    {tags.map((tag, index) =>
                        <Tag
                            key={index}
                            color={tag.color}
                            bgColor={tag.bgColor}
                        >
                            {tag.name}
                        </Tag>
                    )}
                </div>
            )}
            <span className='text-xs text-gray-500'>0/5</span>
            <Transition
                as={Fragment}
                appear
                show={open}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-0'
                enterTo='opacity-100 translate-y-1'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <div
                    className={clsx(
                        'absolute bg-neutral-800 border border-solid border-neutral-700 rounded-md',
                        'w-full left-0 top-12 z-10 py-2 px-3 shadow-lg',
                    )}
                >
                    tag1
                </div>
            </Transition>
        </div>
    );
}