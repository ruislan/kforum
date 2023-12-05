import dynamic from 'next/dynamic';

import { discussionModel } from '@/lib/models';
import Box from '@/components/ui/box';

const About = dynamic(() => import('@/components/about'));
const DiscussionList = dynamic(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));

async function getDiscussions() {
  return await discussionModel.getDiscussions({
    withFirstPost: true,
    isStickyFirst: true
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
        <DiscussionList discussions={discussions} hasMore={hasMore} isStickyFirst={false} categoryId={null} />
      </div>
      <div className='flex flex-col w-80 gap-4'>
        <About />
        <Box className='flex flex-col gap-3'><ActionCreate category={null} /></Box>
        <CategoryBox isSticky />
      </div>
    </div>
  )
}
