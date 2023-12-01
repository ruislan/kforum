'use client';
import clsx from 'clsx';

export default function Tag({ color, bgColor, className, ...rest }) {
    return (
        <div
            className={clsx(
                'inline-block align-text-top',
                'text-xs font-semibold hover:opacity-90',
                !color && 'text-neutral-50',
                !bgColor && 'bg-neutral-700',
                'cursor-pointer hover:shadow-md px-2 py-1 rounded-md',
                className
            )}
            style={{
                color: color || undefined,
                backgroundColor: bgColor || undefined,
            }}
            {...rest}
        />
    );
}