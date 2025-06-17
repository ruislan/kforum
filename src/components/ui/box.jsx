'use client';
import clsx from 'clsx';

export default function Box({ className, ...rest }) {

    return (
        <div className={clsx('bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md', className)} {...rest} />
    );
}