import bcrypt from 'bcrypt';
import prisma from './prisma';
import pageUtils from './page-utils';

export const userModel = {
    fields: {
        simple: { id: true, name: true, email: true, gender: true, avatar: true },
        passport: { id: true, name: true, email: true, gender: true, avatar: true, isAdmin: true }
    },
    async getUser({ id, fields, ignoreSensitive = true }) {
        const queryCondition = { where: { id } };
        if (fields) queryCondition.select = fields;

        const user = await prisma.user.findUnique(queryCondition);

        if (ignoreSensitive) {
            delete user.password;
            delete user.phone;
        }

        return user;
    },
    async getUserByName({
        name,
        withStats = true,
    }) {
        const queryCondition = {
            where: { name },
            select: {
                ...this.fields.simple, createdAt: true,
            }
        };
        if (withStats) {
            queryCondition.select._count = {
                select: {
                    discussions: true,
                    posts: true,
                }
            };
        }
        const user = await prisma.user.findFirst(queryCondition);
        if (!user) return null;
        if (withStats) {
            user.discussionCount = user._count.discussions;
            user.postCount = user._count.posts - user._count.discussions;// sub first posts
            delete user._count;
        }
        return user;
    },
    hashPassword(pwd) {
        return bcrypt.hashSync(pwd, 10);
    },
    comparePassword(plainPwd, hashedPwd) {
        return bcrypt.compareSync(plainPwd, hashedPwd);
    }
};

export const categoryModel = {
    async getCategory(slug) {
        const category = await prisma.category.findUnique({ where: { slug } });
        return category;
    },
    async getCategories() {
        // XXX flat the categories or just first level categories
        return await prisma.category.findMany({ orderBy: { sequence: 'asc' } });
    }
};

export const discussionModel = {
    async getDiscussions({
        categoryId = null,
        page = 1,
        isStickyFirst = false,
        isOldFirst = true,
        withFirstPost = false,
    }) {
        const orderBy = []; // 注意 orderBy 的顺序
        if (isStickyFirst) orderBy.push({ isSticky: 'desc' }); // XXX 默认顺序下：SQLite 会将false放前面，因为False=0,True=1。其他 DB 可能会将True排前面。
        if (isOldFirst) orderBy.push({ createdAt: 'desc' });

        const queryCondition = {
            orderBy,
            include: {
                user: true,
                _count: {
                    select: { posts: true },
                }
            }
        };
        if (withFirstPost) queryCondition.include.firstPost = true;

        if (categoryId) {
            queryCondition.where = { categoryId };
        } else {
            queryCondition.include.category = {
                select: { id: true, name: true, slug: true, color: true, icon: true }
            };
        }

        const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);
        queryCondition.take = take;
        queryCondition.skip = skip;

        const countCondition = queryCondition.where ? { where: queryCondition.where } : {};
        const countFetch = prisma.discussion.count(countCondition);
        const discussionsFetch = prisma.discussion.findMany(queryCondition);
        const [discussions, count] = await Promise.all([discussionsFetch, countFetch]);
        discussions.forEach(d => {
            d.postCount = d._count.posts - 1; // sub first posts
            delete d._count;
        });

        return { discussions, hasMore: count > skip + take };
    },
    async incrementDiscussionView({ id }) {
        await prisma.discussion.update({
            where: { id },
            data: {
                viewCount: { increment: 1 },
            }
        });
    },
    async getDiscussion({ id }) {
        if (!id) return null;
        const d = await prisma.discussion.findUnique({
            where: { id },
            include: {
                user: { select: userModel.fields.simple },
                category: { select: { id: true, name: true, slug: true, color: true, icon: true } },
                firstPost: true,
                posts: {
                    where: {
                        firstPostDiscussion: null, // 不包含首贴
                    },
                    include: {
                        reactions: {
                            select: {
                                userId: true, postId: true, reaction: true,
                            }
                        },
                        user: { select: userModel.fields.simple },
                        replyPost: {
                            include: {
                                user: { select: userModel.fields.simple }
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 10,
                    skip: 0
                },
            },
        });
        if (d) {
            // avoid n + 1, batch load reactions;
            const postIds = [d.firstPost.id, ...d.posts.map(p => p.id)];
            const refs = await prisma.PostReactionRef.groupBy({
                by: ['reactionId', 'postId'],
                where: {
                    postId: { in: postIds }
                },
                _count: {
                    userId: true
                }
            });
            const reactionIds = refs.map(r => r.reactionId);
            const reactions = await prisma.reaction.findMany({
                where: {
                    id: { in: reactionIds }
                }
            });
            for (const post of [d.firstPost, ...d.posts]) {
                post.reactions = refs.filter(r => r.postId === post.id).map(r => {
                    const reaction = reactions.find(re => re.id === r.reactionId);
                    return {
                        ...reaction,
                        count: r._count.userId
                    }
                });
                post.reactions.sort((a, b) => b.count - a.count);
            }
        }
        return d;
    }
};
