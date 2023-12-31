import dynamic from 'next/dynamic';

import { discussionModel } from '@/models';
import Box from '@/components/ui/box';
import { DISCUSSION_SORT } from '@/lib/constants';

const About = dynamic(() => import('@/components/about'));
const DiscussionList = dynamic(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));
const SortPanel = dynamic(() => import('@/components/discussion/sort-panel'));

async function getDiscussions(sort) {
  return await discussionModel.getDiscussions({
    sort,
    withFirstPost: true,
  });
}

export const metadata = {
  title: '首页'
}

export default async function Home({ searchParams }) {
  const sort = searchParams.sort || DISCUSSION_SORT[0];
  const { discussions, hasMore } = await getDiscussions(sort);

  return (
    <div className='flex w-full h-full gap-6'>
      <div className='flex flex-col flex-1'>
        <SortPanel />
        <DiscussionList
          discussions={discussions}
          hasMore={hasMore}
          categoryId={null}
        />
      </div>
      <div className='flex flex-col w-80 gap-4'>
        <About />
        <Box className='flex flex-col gap-3'><ActionCreate category={null} /></Box>
        <CategoryBox isSticky />
      </div>
    </div>
  )
}
