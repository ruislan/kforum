import dynamicImport from 'next/dynamic';

import { discussionModel } from '@/models';
import Box from '@/components/ui/box';
import { DISCUSSION_SORT } from '@/lib/constants';

const About = dynamicImport(() => import('@/components/about'));
const DiscussionList = dynamicImport(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamicImport(() => import('@/components/category/category-box'));
const ActionCreate = dynamicImport(() => import('@/components/discussion/action-create'));
const SortPanel = dynamicImport(() => import('@/components/discussion/sort-panel'));
const ModeratorBox = dynamicImport(() => import('@/components/user/moderator-box'));
const BackToTop = dynamicImport(() => import('@/components/ui/back-to-top'));

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
    <div className='flex md:flex-row flex-col w-full h-full gap-6'>
      <div className='flex flex-col flex-1'>
        <SortPanel />
        <DiscussionList
          discussions={discussions}
          hasMore={hasMore}
          categoryId={null}
        />
      </div>
      <div className='flex flex-col md:w-80 w-full gap-4'>
        <About />
        <Box className='flex flex-col gap-3'><ActionCreate category={null} /></Box>
        <CategoryBox />
        <ModeratorBox />
        <BackToTop />
      </div>
    </div>
  )
}
