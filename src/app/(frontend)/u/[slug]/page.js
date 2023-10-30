import { userModel } from '@/lib/models';
import UserInfo from '@/components/user/user-info';
import UserTabs from '@/components/user/user-tabs';

export default async function Page({ params, searchParams }) {
  const user = await userModel.getUserByName({ name: params.slug });
  if (!user) return <div>User not found</div>;
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 w-max-[680px]'>
        {/* user tabs
            1. overview(activities) v3
            2. discussions v1
            3. posts v1
            4. Saved / Favorite v2
            5. following v2
            6. followers v2
         */}
        <UserTabs user={user} tab={searchParams.tab} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* user info card v1 */}
        <UserInfo user={user} />
      </div>
    </div>
  );
}
