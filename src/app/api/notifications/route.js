import _ from 'lodash';
import { getServerSession } from 'next-auth';

import rest from '@/lib/rest';
import authOptions from '@/lib/auth';
import { ModelError, notificationModel } from '@/models';
import { NOTIFICATION_TYPES } from '@/lib/constants';

export async function GET(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const { notifications, hasMore } = await notificationModel.getNotifications({
        user: session.user,
        page,
    });
    return rest.ok({ data: notifications, hasMore });
    // return rest.ok({
    //     data: [
    //         {
    //             type: NOTIFICATION_TYPES.NEW_DISCUSSION,
    //             data: {
    //                 discussion: {
    //                     id: 1,
    //                     title: 'somesomesomesomesomesomesomesomesome',
    //                 },
    //                 user: {
    //                     id: 1,
    //                     name: 'admin',
    //                     avatar: '/uploads/2024/02/02/bb36492b64f5b4560d2a7053c22df8f84a839054.jpeg',
    //                 }
    //             },
    //             isRead: false,
    //             createdAt: new Date(),
    //         },
    //         {
    //             type: NOTIFICATION_TYPES.NEW_POST,
    //             data: {
    //                 discussion: {
    //                     id: 1,
    //                     title: 'somesomesomesomesomesomesomesomesomesome',
    //                 },
    //                 post: {
    //                     id: 1,
    //                     content: 'some some some some',
    //                 },
    //                 user: {
    //                     id: 1,
    //                     name: 'admin',
    //                     avatar: '/uploads/2024/02/02/bb36492b64f5b4560d2a7053c22df8f84a839054.jpeg',
    //                 }
    //             },
    //             isRead: false,
    //             createdAt: new Date(),
    //         }
    //     ],
    //     hasMore: true,
    // })
}
