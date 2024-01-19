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
    <div className='flex md:flex-row flex-col w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 order-2 md:order-1'>
        <UserTabs user={user} tab={searchParams.tab} />
      </div>
      {/* right side */}
      <div className='flex flex-col md:w-80 w-full order-1 md:order-2 gap-4'>
        {/* user info card v1 */}
        <UserInfo user={user} />
      </div>
    </div>
  );
}
