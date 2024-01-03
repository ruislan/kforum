'use client';

import { Locked, Pined } from '../icons';
import Tooltip from './tooltip';


export default function DiscussionMark({
    isSticky,
    isLocked,
}) {
    return (
        <div className='flex items-center ml-1.5 gap-0.5'>
            {isSticky && (
                <Tooltip content={
                    <div className='whitespace-nowrap text-xs'>
                        被置顶
                    </div>
                }>
                    <span className='h-4 w-4 text-green-400'>
                        <Pined />
                    </span>
                </Tooltip>
            )}
            {isLocked && (
                <Tooltip content={
                    <div className='whitespace-nowrap text-xs'>
                        被锁定
                    </div>
                }>
                    <span className='h-3.5 w-3.5 text-yellow-400'>
                        <Locked />
                    </span>
                </Tooltip>
            )}
        </div>
    );
}