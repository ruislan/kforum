import CategoryList from '@/components/category-list';
import DiscussionList from '@/components/discussion-list';
import UserActions from '@/components/user-actions';

export default function Home() {
  return (
    <div className='flex w-full min-h-screen gap-6'>
      {/* main container:
              1) discussions
                center: filter[best(?), hot(一段时间内活跃最多), top(置顶), new(最新创建), rising(和hot要有区别，是什么呢？)] / discussion list
                right: create discussion / recent posted discussions
              2) discussion/[id]
                center: discussion / posts / create post(reply someone?)
                right side: about discussion (some meta) / related discussions
              3) user/[id]
                center: summary / activity / badge / notification  (user himself) / settings (user himself)
              4) ...
           */}
      <div className='flex flex-col w-[680px]'>
        <DiscussionList />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <UserActions category={null} />
        <CategoryList />
      </div>
    </div>
  )
}
