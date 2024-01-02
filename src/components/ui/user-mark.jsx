'use client';

import { Locked, ModeratorFilledIcon, AdminFilledIcon } from '../icons';


export default function UserMark({
    isAdmin,
    isLocked,
    isModerator,
}) {
    return (
        <div className='flex items-center ml-1 gap-1.5'>
            {isAdmin && (<span className='h-3.5 w-3.5 text-yellow-500'><AdminFilledIcon /></span>)}
            {isModerator && (<span className='h-3.5 w-3.5 text-purple-400'><ModeratorFilledIcon /></span>)}
            {isLocked && (<span className='h-3.5 w-3.5 text-orange-400'><Locked /></span>)}
        </div>
    );
}