import dynamicImport from 'next/dynamic';
import Link from 'next/link';

import Box from '@/components/ui/box';
import { HeadingSmall } from '@/components/ui/heading';
import { categoryModel } from '@/models';
import { EyeIcon } from '@/components/icons';

const CategoryForm = dynamicImport(() => import('@/components/admin-panel/category/category-form'));

export default async function Page({ searchParams }) {
    const slug = searchParams.slug;
    let category = null;
    if (slug) category = await categoryModel.getCategory({ slug, withStats: false });

    return (
        <Box className='flex flex-col'>
            <div className='flex items-center mb-3 gap-4'>
                <HeadingSmall tight>{category ? `更新分类` : '新建分类'}</HeadingSmall>
                {category && (
                    <Link
                        href={`/c/${slug}`}
                        className='w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-50 transition-all'
                    >
                        <EyeIcon />
                    </Link>
                )}
            </div>

            <CategoryForm category={category} />
        </Box>
    )
}
