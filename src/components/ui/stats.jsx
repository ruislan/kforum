'use client';

export default function Stats({ name, value }) {
    return (
        <div className='flex flex-col text-sm'>
            <div className='text-gray-100'>{name}</div>
            <div className='text-gray-400'>{value}</div>
        </div>
    );
}