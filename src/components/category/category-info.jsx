'use client';
import Box from '../ui/box';

export default function CategoryInfo({ category }) {
    if (!category) return null;
    return (
        <Box className='flex flex-col text-sm '>
            <div className='text-gray-400 font-bold mb-3'>{category.name}</div>
            <div className='text-gray-100 mb-3'>{category.description}</div>
            <div className='text-gray-400'>创建于 {category.createdAt.toLocaleDateString()}</div>
        </Box>
    );
}
