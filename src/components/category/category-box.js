import Link from 'next/link';
import Image from 'next/image';

import { categoryModel } from '@/lib/models';

import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';
import { Blank as BlankIcon, Plus } from '../icons';

async function getCategories() {
    return await categoryModel.getCategories();
}

// this is a server component
export default async function CategoryBox() {
    const categories = await getCategories();
    if (!categories) return null;
    return (
        <Box className='flex flex-col'>
            <div className='flex items-center gap-4 mb-3'>
                <HeadingSmall tight>讨论分类</HeadingSmall>
                <Link href='/admin-panel/category'
                    className='w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-50 transition-all'>
                    <Plus />
                </Link>
            </div>
            <div className='flex flex-col gap-1'>
                {categories.map(c =>
                    <Link key={c.slug} href={`/c/${c.slug}`} className='hover:underline underline-offset-2'>
                        <div className='flex items-center gap-1 text-sm'>
                            {c.icon ?
                                <span><Image alt={c.name} src={c.icon} className='w-4 h-4 rounded' /></span> :
                                <span className='w-5 h-5 text-gray-300 rounded' style={{ color: `${c.color}`, }}><BlankIcon /></span>
                            }
                            <span>{c.name}</span>
                        </div>
                    </Link>
                )}
            </div>
        </Box>
    );
}