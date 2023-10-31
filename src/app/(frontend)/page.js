import { categoryModel, discussionModel } from '@/lib/models';

import CategoryList from '@/components/category/category-list';
import DiscussionList from '@/components/discussion/discussion-list';
import ActionCreate from '@/components/discussion/action-create';
import Box from '@/components/ui/box';

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
      <div className='flex flex-col flex-1 w-[680px] w-max-[680px]'>
        <DiscussionList discussions={discussions} hasMore={hasMore} isStickyFirst={false} categoryId={null} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* TODO forum description and stats, like discussions, posts, users, */}
        <Box className='flex flex-col'>
          <h3 className='text-sm text-gray-400 font-bold mb-3'>关于</h3>
          <div className='text-sm text-gray-100'>
            KForum 是一个开源的在线论坛。基于 NextJS、Prisma 等技术。
            秉承开源、简单、便捷、易用、易扩展和集成的理念，旨在帮助公司、组织或个人
            快速建立一个现代且时尚的在线论坛。
          </div>
        </Box>
        <Box className='flex flex-col gap-3'><ActionCreate category={null} /></Box>
        <CategoryList />
      </div>
    </div>
  )
}
