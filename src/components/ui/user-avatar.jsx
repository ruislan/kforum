'use client';
import clsx from 'clsx';
import Image from 'next/image';

const variants = {
    base: 'bg-gray-300',
    size: {
        default: 'w-9 h-9 rounded',
        xs: 'w-5 h-5 rounded',
        sm: 'w-7 h-7 rounded',
        lg: 'w-12 h-12 rounded-lg',
        xl: 'w-16 h-16 rounded-lg',
        '2xl': 'w-32 h-32 rounded-lg',
    },
};

export default function UserAvatar({
    name,
    avatar,
    size = 'default',
    className
}) {
    return (
        <div className={clsx(
            variants.base,
            variants.size[size],
            className
        )}>
            <Image
                className='rounded w-full h-full'
                width={40}
                height={40}
                src={avatar}
                alt={name} />
        </div>
    );
}