import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { discussionModel } from '@/lib/models';
import Box from '@/components/ui/box';

const DiscussionDetail = dynamic(() => import('@/components/discussion/discussion-detail'));
const DiscussionStats = dynamic(() => import('@/components/discussion/discussion-detail-stats'));
const CategoryList = dynamic(() => import('@/components/category/category-list'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));

export default async function Page({ params }) {
  const id = Number(params.id);

  const d = await discussionModel.getDiscussion({ id });
  if (!d) notFound();

  // we must assure the discussion exists
  await discussionModel.incrementDiscussionView({ id: d.id });

  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 gap-2'>
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
