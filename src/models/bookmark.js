import _ from 'lodash';
import prisma from '@/lib/prisma';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';
import userModel from './user';
import categoryModel from './category';

const bookmarkModel = {
    errors: {
    },
    async create({ postId, userId }) {
        const count = await prisma.bookmark.count({
            where: {
                postId,
                userId,
            }
        });
        if (count > 0) return;
        await prisma.bookmark.create({
            data: {
                postId,
                userId,
            }
        });
    },
    async delete({ postId, userId }) {
        // he can only delete his bookmark.
        await prisma.bookmark.delete({
            where: {
                userId_postId: {
                    userId,
                    postId,
                }
            }
        });
    },
    async getBookmark({
        userId,
        postId,
    }) {
        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });
        return bookmark;
    },
    async getBookmarksByPosts({
        userId,
        postIds,
    }) {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId,
                postId: {
                    in: postIds
                }
            },
        });
        return bookmarks;
    },
    async getUserBookmarks({
        username,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT,
    }) {
        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;

        const user = await prisma.user.findUnique({ where: { name: username } });
        if (!user) return { bookmarks: [] };

        const whereClause = {
            userId: user.id,
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
            include: {
                post: {
                    include: {
                        discussion: {
                            include: {
                                category: {
                                    select: categoryModel.fields.simple
                                },
                                user: {
                                    select: userModel.fields.short
                                }
                            }
                        }
                    }
                }
            },
            skip,
            take
        });

        return { bookmarks, hasMore: count > skip + take };
    }
};

export default bookmarkModel;