import { Fragment } from 'react';
import clsx from 'clsx';
import { Popover, Transition } from '@headlessui/react';
import ProseContent from '../ui/prose-content';

export default function PostDetailPopover({ post }) {
    if (!post) return null;
    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button className={clsx('text-xs underline-offset-2 cursor-pointer', open ? 'underline' : 'hover:underline')}>
                        u/{post.user.name}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200' enterFrom='opacity-0 translate-y-1' enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150' leaveFrom='opacity-100 translate-y-0' leaveTo='opacity-0 translate-y-1'
                    >
                        <Popover.Panel className='absolute bottom-full left-[160px] z-10 mb-2 -translate-x-1/2 transform px-4'>
                            <div className='overflow-auto bg-neutral-800 border border-solid border-neutral-500 w-screen max-w-sm max-h-[340px] rounded-md shadow-xl'>
                                <div className='flex flex-col p-3'>
                                    <ProseContent content={post.content} />
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}