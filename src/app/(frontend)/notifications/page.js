import { getServerSession } from 'next-auth';
import dynamicImport from 'next/dynamic';

import authOptions from '@/lib/auth';
import { notificationModel } from '@/models';

const Notifications = dynamicImport(() => import('@/components/notification/notifications'));

export default async function Page() {
    const session = await getServerSession(authOptions);
    const notifications = await notificationModel.getNotifications({ userId: session?.user?.id });

    return (
        <div className='flex md:flex-row flex-col w-full md:w-[680px] h-full gap-6 mx-auto'>
            <Notifications notifications={notifications} />
        </div>
    )
}
