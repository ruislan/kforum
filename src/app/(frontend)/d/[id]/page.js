import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { discussionModel } from '@/lib/models';
import Box from '@/components/ui/box';

const DiscussionDetail = dynamic(() => import('@/components/discussion/discussion-detail'));
const DiscussionStats = dynamic(() => import('@/components/discussion/discussion-detail-stats'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: '话题',  // FIXME 如果在这里动态获取，则会和 Page 一起调用两次，后面来解决，现在就这样
  };
}

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
        <CategoryBox />
      </div>
    </div>
  )
}
