import prisma from '@/lib/prisma';
import { userModal } from '@/lib/models';

import Box from '@/components/ui/box';
import ActionCreate from '@/components/discussion/action-create';
import DiscussionDetail from '@/components/discussion/discussion-detail';

async function incrementDiscussionView({ id }) {
  await prisma.discussion.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
    }
  });
}

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
          reactions: {
            select: {
              userId: true, postId: true, reaction: true,
            }
          },
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
    // avoid n + 1, batch load reactions;
    const postIds = [d.firstPost.id, ...d.posts.map(p => p.id)];
    const refs = await prisma.PostReactionRef.groupBy({
      by: ['reactionId', 'postId'],
      where: {
        postId: { in: postIds }
      },
      _count: {
        userId: true
      }
    });
    const reactionIds = refs.map(r => r.reactionId);
    const reactions = await prisma.reaction.findMany({
      where: {
        id: { in: reactionIds }
      }
    });
    for (const post of [d.firstPost, ...d.posts]) {
      post.reactions = refs.filter(r => r.postId === post.id).map(r => {
        const reaction = reactions.find(re => re.id === r.reactionId);
        return {
          ...reaction,
          count: r._count.userId
        }
      });
      post.reactions.sort((a, b) => b.count - a.count);
    }
  }
  return d;
}

export default async function Page({ params }) {
  const id = Number(params.id);
  const [d, _] = await Promise.all([getDiscussion({ id }), incrementDiscussionView({ id })]);
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
        <Box className='flex flex-col gap-3'><ActionCreate /></Box>
      </div>
    </div>
  )
}
