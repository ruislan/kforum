'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DISCUSSION_COLLECTOR } from '@/lib/constants';
import Box from '../ui/box';
import { FireIcon, HistoryIcon } from '../icons';


function getCollector(pathname) {
    let co = DISCUSSION_COLLECTOR.find(c => pathname.includes(c));
    if (co) return co;
    else return DISCUSSION_COLLECTOR[0];
}

// TODO 这个地方要重写
// 2个不同的collector 应该还是两个不同的地址，然后
// 首页 / => /hot，
// 最新 /new
// 分类页 /c/{slug} => /c/{slug}/hot
// 分类页最新 /c/{slug}/new

export default function FilterPanel({ category }) {
    const pathname = usePathname();
    const collector = getCollector(pathname);
    const hotUrl = useMemo(() => {
        if (category?.slug) return `/c/${category.slug}/hot`;
        else return `/${DISCUSSION_COLLECTOR[0]}`;
    }, [category?.slug]);
    const newUrl = useMemo(() => {
        if (category?.slug) return `/c/${category.slug}/new`;
        else return `/${DISCUSSION_COLLECTOR[1]}`;
    }, [category?.slug]);

    return (
        <Box className='flex items-center gap-2 mb-4'>
            <Link
                className={clsx(
                    'flex items-center gap-1 px-4 py-2',
                    'hover:bg-neutral-700 rounded-md font-semibold text-sm ',
                    collector === DISCUSSION_COLLECTOR[0] ? 'bg-neutral-700 text-gray-50' : 'text-gray-400',
                )}
                href={hotUrl}
            >
                <span className='w-4 h-4'><FireIcon /></span>
                <span>最热</span>
            </Link>
            <Link
                className={clsx(
                    'flex items-center gap-1 px-4 py-2',
                    'hover:bg-neutral-700 rounded-md font-semibold text-sm ',
                    collector === DISCUSSION_COLLECTOR[1] ? 'bg-neutral-700 text-gray-50' : 'text-gray-400',
                )}
                href={newUrl}
            >
                <span className='w-4 h-4'><HistoryIcon /></span>
                <span>最新</span>
            </Link>
        </Box>
    );
}