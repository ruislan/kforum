'use client';

import { Locked, ModeratorFilledIcon, AdminFilledIcon } from '../icons';
import Tooltip from './tooltip';


export default function UserMark({
    isAdmin,
    isLocked,
    isModerator,
}) {
    return (
        <div className='flex items-center ml-1 gap-1.5'>
            {isAdmin && (
                <Tooltip content={
                    <div className='whitespace-nowrap text-xs'>
                        管理员
                    </div>
                }>
                    <span className='h-3.5 w-3.5 text-yellow-500'>
                        <AdminFilledIcon />
                    </span>
                </Tooltip>
            )}
            {isModerator && (
                <Tooltip content={
                    <div className='whitespace-nowrap text-xs'>
                        版主
                    </div>
                }>
                    <span className='h-3.5 w-3.5 text-purple-400'>
                        <ModeratorFilledIcon />
                    </span>
                </Tooltip>
            )}
            {isLocked && (
                <Tooltip content={
                    <div className='whitespace-nowrap text-xs'>
                        被封锁
                    </div>
                }>
                    <span className='h-3.5 w-3.5 text-orange-400'>
                        <Locked />
                    </span>
                </Tooltip>
            )}
        </div>
    );
}