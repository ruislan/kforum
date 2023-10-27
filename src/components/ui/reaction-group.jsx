'use client';

import { Fragment, useMemo } from 'react';
import Reaction from './reaction';
import { Popover, Transition } from '@headlessui/react';

const OVERFLOW_LIMIT = 3;

export default function ReactionGroup({ reactions }) {
    const isOverflow = useMemo(() => reactions?.length > OVERFLOW_LIMIT, [reactions?.length]);
    const showReactions = reactions?.slice(0, isOverflow ? OVERFLOW_LIMIT : reactions?.length);
    const restReactions = reactions?.slice(isOverflow ? OVERFLOW_LIMIT : reactions?.length);
    return (
        <div className='relative flex items-center gap-2'>
            {showReactions?.map(r => <Reaction key={r.id} data={r} />)}
            {isOverflow && (
                <Popover>
                    <Popover.Button className='text-xs text-gray-300 hover:text-gray-300/90 underline underline-offset-2 outline-none'>更多反馈</Popover.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200' enterFrom='opacity-0 translate-y-1' enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150' leaveFrom='opacity-100 translate-y-0' leaveTo='opacity-0 translate-y-1'
                    >
                        <Popover.Panel className='absolute mb-1 bottom-full flex flex-wrap gap-2 bg-neutral-800 border border-neutral-700 w-max max-w-xs z-10 p-2 rounded shadow-lg'>
                            {restReactions?.map(r => <Reaction key={r.id} data={r} />)}
                        </Popover.Panel>
                    </Transition>
                </Popover>
            )}
        </div>
    );
}