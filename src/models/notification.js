import _ from 'lodash';
import prisma from '@/lib/prisma';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';

const notificationModel = {
    errors: {
    },
    fields: {
    },
    async getNotifications({
        user,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT,
    }) {
        if (!user?.id) return [];
        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;

        const fetchCount = prisma.notification.count({
            where: {
                userId: user.id,
                isRead: false,
            }
        });
        const fetchDataList = prisma.notification.findMany({
            where: {
                userId: user.id,
                isRead: false,
            },
            orderBy: [
                { createdAt: 'desc' }
            ],
            skip,
            take
        });

        const [notifications, count] = await Promise.all([fetchDataList, fetchCount]);

        return { notifications, hasMore: count > skip + take };
    },
    async markAsRead({
        user
    }){
        await prisma.notification.updateMany({
            where: {
                userId: user.id,
                isRead: false,
            },
            data: {
                isRead: true,
            }
        });
    }
};

export default notificationModel;
