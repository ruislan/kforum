'use client';
import Box from './ui/box';

export default function DiscussionInfo({ d }) {
    return (
        <Box className='flex flex-col'>
            {/*
                discussion meta
                Creator (avatar) CreatedAt
                Latest reply User (avatar) RepliedAt
                replies | users | reactions
                user replies rank (u1 u2 u3 ...)
             */}
            <div className='text-lg font-bold'>{d.title}</div>
            <div className='text-xs'>{d.user.name} * {d.createdAt.toLocaleString()}</div>
        </Box>
    );
}
