import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { userModel } from '@/models';
import authOptions from '@/lib/auth';

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

    const session = await getServerSession(authOptions);
    if (!!session?.user && session.user.id !== user.id) {
        // get user follow status
        const isFollowed = await userModel.isUserFollowed({ userId: session.user.id, followingUserId: user.id });
        user.isFollowed = isFollowed;
    }

    return (
        <div className='flex md:flex-row flex-col w-full h-full gap-6'>
            <div className='flex flex-col flex-1 md:max-w-main order-2 md:order-1'>
                <UserTabs user={user} tab={searchParams.tab} />
            </div>
            <div className='flex flex-col md:w-80 w-full order-1 md:order-2 gap-4'>
                <UserInfo user={user} />
            </div>
        </div>
    );
}
