'use client';
import clsx from 'clsx';
import Image from 'next/image';

export default function Reaction({ data }) {
    return (
        <div className={clsx(
            'flex items-center gap-0.5 shadow',
            'bg-neutral-800 rounded-lg'
        )}>
            <Image key={data.id} width={16} height={16} src={data.icon} alt={data.name} />
            <span className='text-sm font-bold text-gray-200 font-mono'>{data.count}</span>
        </div>
    );
}