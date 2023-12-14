'use client';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import Box from '../ui/box';
import { useRef, useState } from 'react';
import useOutsideClick from '@/hooks/use-outside-click';

export default function NavMenusDropdown({ menus }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();
    useOutsideClick(ref, () => setIsOpen(false));
    return (
        <div className='h-full py-1'>
            <div className='relative flex items-center ml-4 h-full'>
                <div
                    ref={ref}
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        'font-semibold transition-al no-underline min-w-fit whitespace-nowrap',
                        'text-neutral-400 hover:text-neutral-100 cursor-pointer'
                    )}>
                    更多
                </div>
            </div>
            <Transition
                as='div'
                appear
                show={isOpen}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
            >
                <Box className='absolute top-full right-0 mt-2 w-56 origin-top-right flex flex-col text-gray-100'>
                    {menus.map(({ url, name, isTargetBlank }) => (
                        <Link
                            key={url}
                            href={url}
                            target={isTargetBlank ? '_blank' : '_self'}
                            className={clsx(
                                'font-semibold transition-all no-underline hover:bg-neutral-700 p-2',
                                'text-neutral-400 hover:text-neutral-100 rounded-md',
                            )}
                        >
                            {name}
                        </Link>
                    ))}
                </Box>
            </Transition>
        </div>
    );
}