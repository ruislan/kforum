'use client';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

const Tooltip = ({ content, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className='relative flex'
        >
            {children}
            <Transition
                as={Fragment}
                show={isOpen}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <div className={clsx(
                    'absolute z-50 mb-1 bottom-full overflow-auto p-1',
                    'text-sm text-gray-200 outline-none',
                    'rounded-md bg-neutral-800 shadow-lg',
                    'border border-solid border-neutral-700',
                )}>
                    {content}
                </div>
            </Transition>
        </div>
    );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;