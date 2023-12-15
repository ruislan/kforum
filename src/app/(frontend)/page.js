import dynamic from 'next/dynamic';

import { discussionModel } from '@/models';
import Box from '@/components/ui/box';
import { DISCUSSION_COLLECTOR } from '@/lib/constants';

const About = dynamic(() => import('@/components/about'));
const DiscussionList = dynamic(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));
const FilterPanel = dynamic(() => import('@/components/discussion/filter-panel'));

async function getDiscussions() {
  return await discussionModel.getDiscussions({
    collector: DISCUSSION_COLLECTOR[0],
    withFirstPost: true,
    isStickyFirst: false // 置顶帖只在分类中存在
  });
}

export const metadata = {
  title: '首页'
}

export default async function Home() {
  const { discussions, hasMore } = await getDiscussions();

  return (
    <div className='flex w-full h-full gap-6'>
      <div className='flex flex-col flex-1'>
        <FilterPanel />
        <DiscussionList
          discussions={discussions}
          hasMore={hasMore}
          isStickyFirst={false}
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
