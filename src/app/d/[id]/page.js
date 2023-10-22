import Box from "@/components/ui/box";
import DiscussionDetail from "@/components/discussion-detail";
import PostList from "@/components/post-list";
import SplitBall from "@/components/split-ball";
import Tiptap from "@/components/ui/tiptap";
import UserActions from "@/components/user-actions";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getDiscussion({ id }) {
  const d = await prisma.discussion.findUnique({ where: { id }, include: { user: true } });
  const posts = await prisma.post.findMany({ where: { discussionId: d.id }, include: { user: true }, orderBy: { createdAt: 'asc' } });
  d.posts = posts;
  return d;
}

export default async function Page({ params }) {
  const d = await getDiscussion({ id: Number(params.id) });
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 w-max-[680px] gap-2'>
        <DiscussionDetail data={d} />
        {/* d.post?.slice(1)} */}
        <PostList posts={[...d.posts, ...d.posts]} />
        <Box className='flex flex-col'>
          <div className='flex mb-3'>
            <div>
              <div className='w-9 h-9 mr-1.5 bg-gray-300 rounded'>
                <img className='w-full h-full rounded' src={'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&size=96'} alt={'user'} />
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <div className='flex items-center mb-1.5 text-xs text-gray-300'>
                <Link href={`/u/${d.user.name}`} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/例子</Link>
                <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                <span>回复给主贴</span>
                <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                <div>回复给 <Link href={`/u/${d.user.name}`} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/xiao</Link></div>
              </div>
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
