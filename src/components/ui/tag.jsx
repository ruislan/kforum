'use client';
import clsx from 'clsx';

export default function Tag({ color, bgColor, className, ...rest }) {
    return (
        <div
            className={clsx(
                'inline-block align-text-top font-sans',
                'text-xs font-medium text-ellipsis whitespace-pre break-normal',
                'hover:opacity-90 overflow-hidden',
                !color && 'text-neutral-50',
                !bgColor && 'bg-neutral-700',
                'cursor-pointer hover:shadow-md px-2 py-0.5 rounded-xl',
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