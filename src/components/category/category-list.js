import Image from 'next/image';
import Link from 'next/link';

import { categoryModel } from '@/lib/models';
import { Blank as BlankIcon } from '../icons';
import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';

async function getCategories() {
    return await categoryModel.getCategories();
}

// this is a server component
export default async function CategoryList() {
    const categories = await getCategories();
    if (!categories) return null;
    return (
        <Box className='flex flex-col'>
            <HeadingSmall>讨论分类</HeadingSmall>
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
