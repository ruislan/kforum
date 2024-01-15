import dynamicImport from 'next/dynamic';

import { categoryModel, discussionModel } from '@/models';
import { notFound } from 'next/navigation';
import Box from '@/components/ui/box';
import { DISCUSSION_SORT } from '@/lib/constants';

const SortPanel = dynamicImport(() => import('@/components/discussion/sort-panel'));
const CategoryInfo = dynamicImport(() => import('@/components/category/category-info'));
const DiscussionList = dynamicImport(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamicImport(() => import('@/components/category/category-box'));
const ActionCreate = dynamicImport(() => import('@/components/discussion/action-create'));
const ModeratorBox = dynamicImport(() => import('@/components/user/moderator-box'));

async function getCategory(slug) {
  return await categoryModel.getCategory({ slug, withStats: true });
}

async function getDiscussions(categoryId, sort) {
  return await discussionModel.getDiscussions({
    sort,
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

export default async function Page({ params, searchParams }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();
  const sort = searchParams.sort || DISCUSSION_SORT[0];
  const { discussions, hasMore } = await getDiscussions(category.id, sort);
  return (
    <div className='flex md:flex-row flex-col w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1'>
        <SortPanel />
        <DiscussionList
          categoryId={category.id}
          discussions={discussions}
          hasMore={hasMore}
        />
      </div>
      {/* right side */}
      <div className='flex flex-col md:w-80 w-full gap-4'>
        <CategoryInfo category={category} />
        <Box className='flex flex-col gap-3'><ActionCreate category={category} /></Box>
        <CategoryBox />
        <ModeratorBox />
      </div>
    </div>
  )
}
