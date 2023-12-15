import dynamic from 'next/dynamic';

import { categoryModel, discussionModel } from '@/models';
import { notFound } from 'next/navigation';
import Box from '@/components/ui/box';
import FilterPanel from '@/components/discussion/filter-panel';
import { DISCUSSION_COLLECTOR } from '@/lib/constants';

const CategoryInfo = dynamic(() => import('@/components/category/category-info'));
const DiscussionList = dynamic(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));

async function getCategory(slug) {
  return await categoryModel.getCategory({ slug, withStats: true });
}

async function getDiscussions(categoryId) {
  return await discussionModel.getDiscussions({
    collector: DISCUSSION_COLLECTOR[0],
    categoryId,
    withFirstPost: true,
    isStickyFirst: true
  });
}

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: params.slug,
  };
}

export default async function Page({ params }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();
  const { discussions, hasMore } = await getDiscussions(category.id);
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1'>
        <FilterPanel category={category} />
        <DiscussionList
          categoryId={category.id}
          discussions={discussions}
          hasMore={hasMore}
          isStickyFirst={true}
        />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <CategoryInfo category={category} />
        <Box className='flex flex-col gap-3'><ActionCreate category={category} /></Box>
        <CategoryBox isSticky />
      </div>
    </div>
  )
}
