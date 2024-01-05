'use client';

import clsx from 'clsx';
import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';
import { CheckIcon } from '../icons';
import { runIfFn } from '@/lib/fn';

export default function SorterBox({
    sorterList,
    selected,
    onClick,
}) {
    if (!sorterList) return null;

    return (
        <Box className='flex flex-col'>
            <div className='flex items-center gap-4 mb-3'>
                <HeadingSmall tight>顺序</HeadingSmall>
            </div>
            <div className='flex flex-col gap-1'>
                {sorterList.map((sorter, index) => {
                    const isChecked = selected && sorter.value === selected.value;
                    return (<div
                        key={index}
                        className={clsx(
                            'flex items-center justify-between p-2',
                            'rounded text-sm cursor-pointer text-gray-200',
                            isChecked ? 'bg-neutral-700' : 'hover:bg-neutral-700'
                        )}
                        onClick={e => {
                            e.preventDefault();
                            runIfFn(onClick, index);
                        }}
                    >
                        <span>{sorter.name}</span>
                        {isChecked && <span className='h-4 w-4'><CheckIcon /></span>}
                    </div>);
                })}
            </div>
        </Box>
    );
}