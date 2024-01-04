import Link from 'next/link';
import Image from 'next/image';

import { categoryModel } from '@/models';

import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';
import { Blank as BlankIcon } from '../icons';
import ActionPlus from './action-plus';

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
                <HeadingSmall tight>分类</HeadingSmall>
                <ActionPlus />
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
