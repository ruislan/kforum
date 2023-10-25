import prisma from '@/lib/prisma';
import { userModal } from '@/lib/models';

import UserActions from '@/components/user/user-actions';
import DiscussionDetail from '@/components/discussion/discussion-detail';

async function getDiscussion({ id }) {
  if (!id) return null;
  const d = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { select: userModal.fields.simple },
      category: { select: { id: true, name: true, slug: true, color: true, icon: true } },
      firstPost: true,
      posts: {
        where: {
          firstPostDiscussion: null, // 不包含首贴
        },
        include: {
          user: { select: userModal.fields.simple },
          replyPost: {
            include: {
              user: { select: userModal.fields.simple }
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: 10,
        skip: 0
      },
    },
  });
  if (d) {
    // increment view count
    await prisma.discussion.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      }
    });
  }
  return d;
}

export default async function Page({ params }) {
  const d = await getDiscussion({ id: Number(params.id) });
  if (!d) return <div>not found</div>
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 w-max-[680px] gap-2'>
        <DiscussionDetail discussion={d} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* discussion'meta */}
        <UserActions />
      </div>
    </div>
  )
}
