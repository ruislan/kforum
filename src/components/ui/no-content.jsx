'use client';

import Box from './box';

export default function NoContent({ text }) {
    return (
        <Box className='h-16 flex justify-center items-center'>
            <span className='text-base font-bold text-neutral-400'>
                {text}
            </span>
        </Box>
    );
}