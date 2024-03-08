'use client';

import clsx from 'clsx';
import { usePathname, useSearchParams } from 'next/navigation';

import Box from '../ui/box';
import { FireIcon, HistoryIcon } from '../icons';

export default function SortPanel() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <Box className='flex items-center gap-2 mb-4 px-2 py-1.5'>
            <a
                className={clsx(
                    'flex items-center gap-1 px-4 py-2',
                    'hover:bg-neutral-700 rounded-md font-semibold text-sm ',
                    (!searchParams.get('sort') || searchParams.get('sort') === 'hot') ?
                        'bg-neutral-700 text-gray-50' :
                        'text-gray-400',
                )}
                href={`${pathname}?sort=hot`}
            >
                <span className='w-4 h-4'><FireIcon /></span>
                <span>最热</span>
            </a>
            <a
                className={clsx(
                    'flex items-center gap-1 px-4 py-2',
                    'hover:bg-neutral-700 rounded-md font-semibold text-sm ',
                    searchParams.get('sort') === 'recent' ? 'bg-neutral-700 text-gray-50' : 'text-gray-400',
                )}
                href={`${pathname}?sort=recent`}
            >
                <span className='w-4 h-4'><HistoryIcon /></span>
                <span>最新</span>
            </a>
        </Box>
    );
}
