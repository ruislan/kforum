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


export default async function Home() {
  const { discussions, hasMore } = await getDiscussions();

  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container:
              1) discussions
                center: filter[best(?), hot(一段时间内活跃最多), top(置顶), new(最新创建), rising(和hot要有区别，是什么呢？)] / discussion list
                right: create discussion / recent posted discussions
              2) discussion/[id]
                center: discussion / posts / create post(reply someone?)
                right side: about discussion (some stats) / related discussions
              3) user/[id]
                center: summary / activity / badge / notification  (user himself) / settings (user himself)
              4) ...
           */}
      <div className='flex flex-col flex-1'>
        <DiscussionList discussions={discussions} hasMore={hasMore} isStickyFirst={false} categoryId={null} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <About />
        <Box className='flex flex-col gap-3'><ActionCreate category={null} /></Box>
        <CategoryBox />
      </div>
    </div>
  )
}
