import { categoryModel } from '@/lib/models';

import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';
import CategoryList from './category-list';

async function getCategories() {
    return await categoryModel.getCategories();
}

// this is a server component
export default async function CategoryBox() {
    const categories = await getCategories();
    if (!categories) return null;
    return (
        <Box className='flex flex-col'>
            <HeadingSmall>讨论分类</HeadingSmall>
            <CategoryList categories={categories} />
        </Box>
    );
}
