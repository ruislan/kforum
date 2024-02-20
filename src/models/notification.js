import _ from 'lodash';
import prisma from '@/lib/prisma';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';
import { NOTIFICATION_TYPES } from '@/lib/constants';

const notificationModel = {
    errors: {
    },
    fields: {
    },
    // notify user's followers
    // async notifyNewDiscussion({
    //     user,
    //     discussion,
    // }) {
    //     await prisma.notification.create({
    //         data: {
    //             userId: user.id,
    //             type: NOTIFICATION_TYPES.NEW_DISCUSSION,
    //         }
    //     });
    // },
    // notify user's followers
    // notify discussions's followers
    async notifyNewPost({ user, post }) {
        const followers = await prisma.discussionFollower.findMany({
            where: {
                discussionId: post.discussionId,
                userId: {
                    not: user.id
                }
            },
            select: {
                userId: true,
            }
        });

        if (!followers) return;

        await prisma.notification.createMany({
            data: followers.map(follower => ({
                userId: follower.userId,
                type: NOTIFICATION_TYPES.NEW_POST,
                data: JSON.stringify({
                    discussion: {
                        id: post.discussionId,
                        title: post.discussion?.title,
                    },
                    post: {
                        id: post.id,
                        content: post.text,
                    },
                    user: {
                        id: post.user.id,
                        name: post.user.name,
                        avatarUrl: post.user.avatarUrl,
                    }
                })
            })),
            skipDuplicates: true
        });
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
    // clear one or all
    async clear({
        user,
        id
    }) {

        await prisma.notification.deleteMany({
            where: {
                userId: user.id,
                id: id > 0 ? id : undefined,
            }
        });
    },
    async markAsRead({
        user
    }) {
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
