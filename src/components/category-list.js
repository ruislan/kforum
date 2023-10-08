import prisma from '@/lib/prisma';
import { Blank as BlankIcon } from './icons';
import Image from 'next/image';
import Box from './box';

async function getCategories() {
    // flat the categories
    return await prisma.category.findMany({ orderBy: { sequence: 'asc' } });
}

export default async function CategoryList() {
    const categories = await getCategories();
    return (
        <Box className='flex flex-col'>
            <div className='text-sm text-gray-400 font-bold mb-3'>讨论分类</div>
            {categories.map(cat =>
                <a key={cat.slug} href={cat.slug} className='hover:underline underline-offset-4'>
                    <div className='flex items-center gap-1 text-sm'>
                        {cat.icon ? <span><Image alt={cat.name} src={cat.icon} className='w-4 h-4 rounded' /></span> : <span className='w-6 h-6 text-gray-300 rounded'><BlankIcon /></span>}
                        <span>{cat.name}</span>
                    </div>
                </a>
            )}
        </Box>
    );
}
