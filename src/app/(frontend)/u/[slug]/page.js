import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';

import { userModel } from '@/models';

const UserInfo = dynamicImport(() => import('@/components/user/user-info'));
const UserTabs = dynamicImport(() => import('@/components/user/user-tabs'));

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: `u/${params.slug}`,
  };
}

export default async function Page({ params, searchParams }) {
  const user = await userModel.getUserByName({ name: params.slug });
  if (!user) notFound();

  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1'>
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
