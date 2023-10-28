'use client';

import clsx from 'clsx';
import { LoadingIcon } from '../icons';

export default function Spinner({ className }) {
    return (
        <div className={clsx('flex justify-center mt-4', className)}>
            <LoadingIcon className='w-8 h-8' />
        </div>
    );
}