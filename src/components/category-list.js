import prisma from '@/lib/prisma';

import Image from 'next/image';
import Link from 'next/link';

import { Blank as BlankIcon } from './icons';
import Box from './box';

async function getCategories() {
    // XXX flat the categories or just first level categories
    return await prisma.category.findMany({ orderBy: { sequence: 'asc' } });
}

export default async function CategoryList() {
    const categories = await getCategories();
    return (
        <Box className='flex flex-col'>
            <div className='text-sm text-gray-400 font-bold mb-3'>讨论分类</div>
            {categories.map(c =>
                <Link key={c.slug} href={`/c/${c.slug}`} className='hover:underline underline-offset-4'>
                    <div className='flex items-center gap-1 text-sm'>
                        {c.icon ? <span><Image alt={c.name} src={c.icon} className='w-4 h-4 rounded' /></span> : <span className='w-6 h-6 text-gray-300 rounded'><BlankIcon /></span>}
                        <span>{c.name}</span>
                    </div>
                </Link>
            )}
        </Box>
    );
}
