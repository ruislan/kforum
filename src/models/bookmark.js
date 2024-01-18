import _ from 'lodash';
import prisma from '@/lib/prisma';
import ModelError from './model-error';

const bookmarkModel = {
    errors: {
    },
    async create({ postId, userId }) {
        await prisma.bookmark.upsert({
            where: {
                postId,
                userId,
            },
            create: {
                postId,
                userId,
            },
            update: {}
        });
    },
    async delete({ bookmarkId, userId }) {
        // he can only delete his bookmark.
        await prisma.bookmark.delete({
            where: {
                id: bookmarkId,
                userId,
            }
        });
    },
    async getBookmarks({
        userId,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT,
    }) {
        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;

        const whereClause = {
            userId,
            post: {
                deletedAt: null
            }
        };

        const count = await prisma.bookmark.count({ where: whereClause });
        const bookmarks = await prisma.bookmark.findMany({
            where: whereClause,
            orderBy: [
                { createdAt: 'desc' }
            ],
            skip,
            take
        });

        return { bookmarks, hasMore: count > skip + take };
    }
};

export default bookmarkModel;