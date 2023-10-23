
import Image from 'next/image';
import Box from '../ui/box';

export default async function UserInfo({ user = null }) {
    if (!user) return null;
    return (
        <Box className='flex flex-col text-sm relative p-3'>
            <div className='absolute h-20 w-full top-0 left-0 bg-neutral-500 rounded-t'></div>
            <div className='w-32 h-32 bg-gray-300 rounded z-10 shadow-lg'>
                <Image width='128' height='128' className='w-full h-full rounded'
                    src={user.avatar}
                    alt='user avatar' />
            </div>
            <div className='text-gray-100 text-xl my-2'>{user.name}</div>
            <div className='grid grid-cols-3'>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>发帖数</div>
                    <div className='text-gray-400'>{user.meta?.discussions || 0}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>回复数</div>
                    <div className='text-gray-400'>{user.meta?.posts || 0}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>注册于</div>
                    <div className='text-gray-400'>{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        </Box>
    );
}
