'use client';
import clsx from 'clsx';

export default function Tag({ className, ...rest }) {
    return (
        <div className={
            clsx('inline-block align-text-top',
                'text-xs font-semibold bg-neutral-700 hover:bg-neutral-600 text-neutral-50 hover:text-neutral-100',
                'cursor-pointer hover:shadow-md px-2 py-1 rounded-md', className)
        } {...rest} />
    );
}