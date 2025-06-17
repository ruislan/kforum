'use client';

import clsx from "clsx";

export default function NoContent({ noWrap = false, text }) {
    return (
        <div className={clsx(
            'h-14 flex flex-col w-full justify-center items-center',
            !noWrap && 'bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md'
        )}>
            <span className='text-base font-bold text-neutral-400'>
                {text}
            </span>
        </div>
    );
}