'use client';

import { Fragment, useMemo } from 'react';
import Reaction from './reaction';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';

const OVERFLOW_LIMIT = 3;

export default function ReactionGroup({ reactions }) {
    const isOverflow = useMemo(() => reactions?.length > OVERFLOW_LIMIT, [reactions?.length]);
    const showReactions = reactions?.slice(0, isOverflow ? OVERFLOW_LIMIT : reactions?.length);
    const restReactions = reactions?.slice(isOverflow ? OVERFLOW_LIMIT : reactions?.length);
    return (
        <div className='relative flex items-center gap-2'>
            {showReactions?.map((r, i) => <Reaction key={i} data={r} />)}
            {isOverflow && (
                <Popover>
                    <Popover.Button className={clsx(
                        'text-xs text-gray-300 hover:text-gray-300/90',
                        'underline underline-offset-2 outline-none'
                    )}>
                        更多
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-1'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-1'
                    >
                        <Popover.Panel className={clsx(
                            'absolute mb-1 bottom-full right-0 md:left-0 md:right-full',
                            'flex flex-wrap gap-2 w-max max-w-xs z-10 p-2',
                            'bg-neutral-800 border border-neutral-700',
                            'rounded shadow-lg'
                        )}>
                            {restReactions?.map(r => <Reaction key={r.id} data={r} />)}
                        </Popover.Panel>
                    </Transition>
                </Popover>
            )}
        </div>
    );
}