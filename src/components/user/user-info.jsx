import Box from '../ui/box';
import Stats from '../ui/stats';
import UserAvatar from '../ui/user-avatar';

export default async function UserInfo({ user = null }) {
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
            <div className='text-gray-100 text-xl my-2'>{user.name}</div>
            <div className='grid grid-cols-3 gap-2 mt-2'>
                <Stats name='话题数' value={user.discussionCount || 0} />
                <Stats name='回复数' value={user.postCount || 0} />
                <Stats name='注册于' value={new Date(user.createdAt).toLocaleDateString()} />
            </div>
        </Box>
    );
}
