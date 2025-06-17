'use client';

import clsx from 'clsx';
import { LoadingIcon } from '../icons';

const variants = {
    size: {
        'default': 'w-8 h-8',
        'sm': 'w-6 h-6',
        'xs': 'w-4 h-4',
        'lg': 'w-12 h-12',
        'xl': 'w-16 h-16'
    }
};

export default function Spinner({ center = false, tight = false, size = 'default', className }) {
    return (
        <div className={clsx('flex justify-center',
            !tight && 'my-4',
            center && 'self-center',
            variants.size[size],
            className)}>
            <LoadingIcon className='w-full h-full' />
        </div>
    );
}