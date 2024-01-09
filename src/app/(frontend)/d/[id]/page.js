import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';
import { discussionModel } from '@/models';
import Box from '@/components/ui/box';

const DiscussionDetail = dynamicImport(() => import('@/components/discussion/discussion-detail'));
const DiscussionStats = dynamicImport(() => import('@/components/discussion/discussion-detail-stats'));
const CategoryBox = dynamicImport(() => import('@/components/category/category-box'));
const ModeratorBox = dynamicImport(() => import('@/components/user/moderator-box'));
const ActionCreate = dynamicImport(() => import('@/components/discussion/action-create'));

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
  await discussionModel.incrementView({ id: d.id });

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
        <ModeratorBox />
      </div>
    </div>
  )
}
