'use client';
import Box from './box';

export default function DiscussionItem({ d }) {
    return (
        <Box className='flex hover:border-neutral-500' onClick={() => location.href = '/d/' + d.id}>
            <div className='mr-4 bg-gray-300 rounded'><img className='w-12 h-12 rounded' src={d.user.avatar} alt={d.user.name} /></div>
            <div className='flex flex-col'>
                <div className='text-lg font-bold'>{d.title}</div>
                <div className='text-xs'>{d.user.name} * {d.createdAt.toLocaleString()}</div>
            </div>
        </Box>
    );
}
