import { discussionModel } from '@/lib/models';

import Box from '@/components/ui/box';
import ActionCreate from '@/components/discussion/action-create';
import DiscussionDetail from '@/components/discussion/discussion-detail';
import DiscussionStats from '@/components/discussion/discussion-detail-stats';
import CategoryList from '@/components/category/category-list';

export default async function Page({ params }) {
  const id = Number(params.id);

  const [d, _] = await Promise.all([
    discussionModel.getDiscussion({ id }),
    discussionModel.incrementDiscussionView({ id })
  ]);

  if (!d) return <div>not found</div>
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 w-[680px] w-max-[680px] gap-2'>
        <DiscussionDetail discussion={d} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <DiscussionStats discussion={d} />
        <Box className='flex flex-col gap-3'><ActionCreate /></Box>
        <CategoryList />
      </div>
    </div>
  )
}
