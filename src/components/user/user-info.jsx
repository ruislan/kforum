'use client';

import Box from '../ui/box';
import Stats from '../ui/stats';
import UserAvatar from '../ui/user-avatar';
import UserMark from '../ui/user-mark';
import ActionFollow from './action-follow';
import { CalenderIcon } from '../icons';

export default function UserInfo({ user = null }) {
    if (!user) return null;
    return (
        <Box className='flex flex-col text-sm relative p-3'>
            <div className='absolute h-20 w-full top-0 left-0 bg-neutral-500 rounded-t'></div>
            <UserAvatar
                size='2xl'
                className='shadow-lg z-10'
                name={user.name}
                avatar={user.avatarUrl}
            />
            <div className='flex items-center my-1'>
                <div className='text-gray-100 text-xl'>{user.name}</div>
                <UserMark isAdmin={user.isAdmin} isModerator={user.isModerator} isLocked={user.isLocked} className='mt-2' />
            </div>
            <div className='flex items-center gap-2 text-gray-400 mb-1'>
                <span className='h-4 w-4 '><CalenderIcon /></span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className='flex items-center gap-2'>
                <ActionFollow user={user} />
            </div>
            <div className='grid grid-cols-3 gap-2 mt-2'>
                <Stats name='话题数' value={user.discussionCount || 0} />
                <Stats name='帖子数' value={user.postCount || 0} />
                <Stats name='声望值' value={user.reputation || 0} />
            </div>
        </Box>
    );
}
