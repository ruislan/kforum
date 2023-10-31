'use client';
import Image from 'next/image';
import Box from '../ui/box';
import Stats from '../ui/stats';

export default function CategoryInfo({ category }) {
    if (!category) return null;
    return (
        <Box className='flex flex-col text-sm'>
            <div className='flex items-center'>
                {category.icon ?
                    <span className='mr-1.5'><Image width={24} height={24} alt={category.name} src={category.icon} className='rounded' /></span> :
                    <span className='w-6 h-6 rounded mr-1.5' style={{ backgroundColor: `${category.color || 'bg-gray-300'}`, }}></span>
                }
                <div className='text-gray-100 text-xl font-bold'>{category.name}</div>
            </div>
            <div className='text-gray-400 mt-1'>c/{category.slug}</div>
            <div className='text-gray-100 my-2'>{category.description}</div>
            <div className='grid grid-cols-3 mt-2'>
                <Stats name='话题数' value={category.discussionCount || 0} />
                <Stats name='创建于' value={new Date(category.createdAt).toLocaleDateString()} />
            </div>
        </Box>
    );
}
