import _ from 'lodash';
import prisma from '@/lib/prisma';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';
import { NOTIFICATION_TYPES } from '@/lib/constants';
import pubsub from '@/lib/pubsub';

const notificationModel = {
    errors: {
    },
    fields: {
    },
    // notify user's followers
    async notifyNewDiscussion({
        user,
        discussion,
    }) {
        const followers = await prisma.userFollower.findMany({
            where: {
                followingId: user.id,
                userId: {
                    not: user.id
                }
            },
            select: {
                userId: true,
            }
        });

        if (followers.length <= 0) return;

        await prisma.notification.createMany({
            data: followers.map(follower => ({
                userId: follower.userId,
                type: NOTIFICATION_TYPES.NEW_DISCUSSION,
                data: JSON.stringify({
                    discussion: {
                        id: discussion.id,
                        title: discussion.title,
                    },
                    user: {
                        id: user.id,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                    }
                })
            })),
            skipDuplicates: true
        });
    },
    // notify user's followers
    // notify discussions's followers
    async notifyNewPost({
        user,
        post
    }) {
        const userFollowers = await prisma.userFollower.findMany({
            where: {
                followingId: user.id,
                userId: {
                    not: user.id
                }
            },
            select: {
                userId: true,
            }
        });
        const discussionFollowers = await prisma.discussionFollower.findMany({
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

        // combine the followers
        let followers = new Set();
        userFollowers.forEach(f => followers.add(f.userId));
        discussionFollowers.forEach(f => followers.add(f.userId));
        followers = Array.from(followers); // convert to array
        if (followers.length <= 0) return; // no followers, return early

        await prisma.notification.createMany({
            data: followers.map(followerId => ({
                userId: followerId,
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
            }
        });
        const fetchDataList = prisma.notification.findMany({
            where: {
                userId: user.id,
            },
            orderBy: [
                { createdAt: 'desc' }
            ],
            skip,
            take
        });

        const [notifications, count] = await Promise.all([fetchDataList, fetchCount]);

        await pubsub.emit('notification', { hello: 'world' });

        return { notifications, hasMore: count > skip + take };
    },
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
    },
    async getUnreadCount({
        user
    }) {
        if (!user) return 0;
        const count = await prisma.notification.count({
            where: {
                userId: user.id,
                isRead: false,
            }
        });
        return count;
    }
};


pubsub.on('notification', async (event) => {
    const type = event?.type;
    switch (type) {
        case NOTIFICATION_TYPES.NEW_DISCUSSION:
            notificationModel.notifyNewDiscussion(event.data);
            break;
        case NOTIFICATION_TYPES.NEW_POST:
            notificationModel.notifyNewPost(event.data);
            break;
        default: break;
    }
});

export default notificationModel;
