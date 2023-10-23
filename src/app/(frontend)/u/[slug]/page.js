import UserInfo from "@/components/user/user-info";
import UserTabs from "@/components/user/user-tabs";
import prisma from "@/lib/prisma";

async function getUser({ name }) {
  const user = await prisma.user.findFirst({
    where: { name },
    include: {
      _count: {
        select: {
          discussions: true,
          posts: true,
        }
      }
    }
  });
  if (!user) return null;
  user.meta = {
    discussions: user._count.discussions,
    posts: user._count.posts - user._count.discussions, // sub first posts
  };
  delete user._count;
  return user;
}

export default async function Page({ params }) {
  const user = await getUser({ name: params.slug });
  if (!user) return <div>User not found</div>;
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 w-max-[680px]'>
        {/* user tabs
            1. overview v1
            2. discussions v1
            3. posts v1
            4. Saved / Favorite v2
            5. following v2
            6. followers v2
         */}
        <UserTabs />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* user info card v1 */}
        <UserInfo user={user} />
      </div>
    </div>
  )
}
