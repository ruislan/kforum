import Box from "@/components/box";
import DiscussionDetail from "@/components/discussion-detail";
import PostList from "@/components/post-list";
import Tiptap from "@/components/tiptap";
import UserActions from "@/components/user-actions";
import prisma from "@/lib/prisma";

async function getDiscussion({ id }) {
  const d = await prisma.discussion.findUnique({ where: { id }, include: { user: true } });
  const posts = await prisma.post.findMany({ where: { discussionId: d.id }, orderBy: { createdAt: 'asc' } });
  d.posts = posts;
  return d;
}

export default async function Page({ params }) {
  const d = await getDiscussion({ id: Number(params.id) });
  return (
    <div className='flex w-full min-h-screen gap-6 mt-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 gap-2'>
        <DiscussionDetail data={d} />
        <PostList posts={d.post?.slice(1)} />
        <Box className='flex flex-col border-none'>
          <div className='flex flex-col w-full'>
            <div>回帖</div>
            <div>
              <Tiptap />
            </div>
          </div>
        </Box>
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* discussion'meta */}
        <UserActions />
      </div>
    </div>
  )
}
