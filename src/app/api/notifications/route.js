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
}
