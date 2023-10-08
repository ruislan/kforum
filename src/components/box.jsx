'use client';
import clsx from 'clsx';

export default function Box({ className, ...rest }) {

    return (
        <div className={clsx('bg-neutral-800/50 p-3 border border-solid border-neutral-700 rounded-md', className)} {...rest} />
    );
}