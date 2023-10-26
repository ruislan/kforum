import prisma from '@/lib/prisma';

import CategoryInfo from '@/components/category/category-info';
import CategoryList from '@/components/category/category-list';
import DiscussionList from '@/components/discussion/discussion-list';
import ActionCreate from '@/components/discussion/action-create';
import Box from '@/components/ui/box';

async function getCategory(slug) {
  const category = await prisma.category.findUnique({ where: {slug}});
  return category;
}

export default async function Page({ params }) {
  const category = await getCategory(params.slug);
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 w-max-[680px]'>
        <DiscussionList category={category} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <CategoryInfo category={category} />
        <Box className='flex flex-col gap-3'><ActionCreate category={category} /></Box>
        <CategoryList />
      </div>
    </div>
  )
}
