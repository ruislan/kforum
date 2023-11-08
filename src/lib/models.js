import bcrypt from 'bcrypt';
import _ from 'lodash';

import prisma from './prisma';
import pageUtils from './page-utils';

export class ModelError extends Error { }

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
    errors: {
        SCHEMA_NAME: '名称是必须的，不小于 2 个字符，不大于 20 个字符',
        SCHEMA_SLUG: 'slug是必须的，只能为小写或数字，不小于 2 个字符，不大于 20 个字符',
        SCHEMA_SEQUENCE: '顺序只能是大于 0 的数字',
        UNIQUE_SLUG: 'slug 已经在使用中',
        CATEGORY_NOT_EMPTY: '该分类下还有话题',
    },
    validate({ name, slug, sequence, description, color }) {
        if (!name || name.length < 2 || name.length > 20) return { error: true, message: this.errors.SCHEMA_NAME };
        if (!slug || slug.length < 2 || slug.length > 20 || !/^[a-z0-9]+$/.test(slug)) return { error: true, message: this.errors.SCHEMA_SLUG };
        if (sequence && (!_.isNumber(sequence) || sequence < 0)) return { error: true, message: this.errors.SCHEMA_SEQUENCE };
        return { error: false };
    },
    async create({ name, slug, sequence, description, color }) {
        // check unique
        const exists = (await prisma.category.count({ where: { slug } })) > 0;
        if (exists) throw new ModelError(this.errors.UNIQUE_SLUG);
        const newCategory = await prisma.category.create({ data: { name, slug, sequence, description, color } });
        return newCategory;
    },
    async update({ id, name, slug, sequence, description, color }) {
        const exists = (await prisma.category.count({
            where: {
                slug,
                id: { not: id },
            }
        })) > 0;
        if (exists) throw new ModelError(this.errors.UNIQUE_SLUG);
        await prisma.category.update({
            where: { id },
            data: { name, slug, sequence, description, color }
        });
    },
    async delete({ id }) {
        // check discussions
        const exists = (await prisma.discussion.count({
            where: {
                categoryId: id,
            }
        })) > 0;
        if (exists) throw new ModelError(this.errors.CATEGORY_NOT_EMPTY);
        await prisma.category.delete({ where: { id } });
    },
    async getCategory({ slug, withStats = true }) {
        const queryCondition = { where: { slug } };
        if (withStats) {
            queryCondition.include = {
                _count: {
                    select: { discussions: true }
                }
            };
        }
        const category = await prisma.category.findUnique(queryCondition);
        if (!category) return null;

        if (withStats) {
            category.discussionCount = category._count.discussions;
            delete category._count;
        }
        return category;
    },
    async getCategories() {
        // XXX flat the categories or just first level categories
        return await prisma.category.findMany({ orderBy: { sequence: 'asc' } });
    }
};

export const postModel = {
    errors: {
        SCHEMA_CONTENT: '内容是必须的，不小于 2 个字符。',
        DISCUSSION_NOT_FOUND: '请指定要回复的话题',
        DISCUSSION_IS_LOCKED: '话题已经被锁定',
        REPLY_TO_POST_NOT_FOUND: '回复的帖子已经删除或不存在',
        POST_NOT_FOUND: '请指定要更新的帖子',
        NO_PERMISSION: '没有操作权限',
    },
    validate({ text, content }) {
        if (!content || content.length < 2) return { error: true, message: this.errors.SCHEMA_CONTENT };
        if (!text || text.length < 2) return { error: true, message: this.errors.SCHEMA_CONTENT };
        return { error: false };
    },
    checkPermission(user, post) {
        const isAdmin = user.isAdmin;
        const isOwner = post.userId === user.id;
        // isModerator ...
        if (!isAdmin && !isOwner) return false;
        return true;
    },
    async count({ condition }) {
        const whereClause = {
            discussionId: { gt: 0 },
        };
        await prisma.post.count();
    },
    async create({ user, content, text, discussionId, replyPostId, ip }) {
        const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
        if (!discussion) throw new ModelError(this.errors.DISCUSSION_NOT_FOUND);
        if (discussion.isLocked) throw new ModelError(this.errors.DISCUSSION_IS_LOCKED);

        // does it reply to a post?
        let replyPost;
        if (replyPostId) {
            replyPost = await prisma.post.findUnique({
                where: { id: replyPostId },
                include: {
                    user: { select: userModel.fields.simple }
                }
            });
            if (!replyPost) throw new ModelError(this.errors.REPLY_TO_POST_NOT_FOUND);
        }


        // 检查用户是否已经发过帖子，没有则增加一次参与人计数
        const sessionUserPosted = await prisma.post.findFirst({
            where: {
                discussionId,
                userId: user.id
            }
        });

        const data = await prisma.$transaction(async tx => {
            const post = await tx.post.create({
                data: {
                    content,
                    text,
                    discussionId,
                    type: 'text',
                    userId: user.id,
                    ip,
                    replyPostId
                }
            });
            const updateData = {
                lastPostId: post.id,
                lastPostedAt: new Date(),
                postCount: { increment: 1 },
            };
            if (!sessionUserPosted) updateData.userCount = { increment: 1 };
            await tx.discussion.update({
                where: { id: discussion.id },
                data: updateData
            });
            return post;
        });

        // add ref
        data.user = user;
        data.replyPost = replyPost;

        return data;
    },
    async update({ user, id, content, text }) {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) throw new ModelError(this.errors.POST_NOT_FOUND);
        if (!this.checkPermission(user, post)) throw new ModelError(this.errors.NO_PERMISSION);

        await prisma.post.update({ where: { id }, data: { content, text } });
    },
    async delete({ user, id }) {
        const post = await prisma.post.findUnique({ where: { id }, include: { discussion: true } });
        if (!post) throw new ModelError(this.errors.POST_NOT_FOUND);
        if (!this.checkPermission(user, post)) throw new ModelError(this.errors.NO_PERMISSION);

        const isFirstPost = post.discussion.firstPostId === post.id;
        await prisma.$transaction(async tx => {
            await tx.PostReactionRef.deleteMany({ where: { postId: post.id } });// delete reactions
            // 不用更新所有回复这贴的引用为null, 外键约束会自动设置为null
            if (isFirstPost) { // delete all
                await tx.post.deleteMany({ where: { discussionId: post.discussion.id } });
                await tx.discussion.delete({ where: { id: post.discussion.id } });
            } else {
                await tx.post.delete({ where: { id: post.id } }); // delete one
            }
        });
    },
    async getPosts({
        discussionId, // 如果有discussionId说明是某个话题下面的回帖
        isOldFirst = false,
        page = 1
    }) {
        const countCondition = {};
        if (discussionId) {
            countCondition.where = { discussionId, firstPostDiscussion: null }; // 去掉首贴，XXX 后面如果追加字段post_number可以直接用post_number > 1
        } else {
            countCondition.where = { discussionId: { gt: 0 } }; // 使用discussionId 作为index
        };
        const fetchCount = prisma.post.count(countCondition);

        const queryCondition = {};
        if (discussionId) {
            queryCondition.where = {
                discussionId,
                firstPostDiscussion: null, // 去掉首贴，XXX 后面如果追加字段post_number可以直接用post_number > 1
            };
        }

        const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);
        queryCondition.take = take;
        queryCondition.skip = skip;
        if (isOldFirst) queryCondition.orderBy = { createdAt: 'desc' };
        queryCondition.include = {
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
        };
        const fetchPosts = await prisma.post.findMany(queryCondition);
        let [posts, count] = await Promise.all([fetchPosts, fetchCount]);

        // avoid n + 1, batch load Posts reactions and reaction stats;
        const postIds = posts.map(p => p.id);
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
        for (const post of posts) {
            post.reactions = refs.filter(r => r.postId === post.id).map(r => {
                const reaction = reactions.find(re => re.id === r.reactionId);
                return {
                    ...reaction,
                    count: r._count.userId
                }
            });
            post.reactions.sort((a, b) => b.count - a.count);
        }
        return { posts, hasMore: count > skip + take };
    }
};

export const discussionModel = {
    async getDiscussions({
        categoryId = null, // 如果有categoryId说明是某个分类下面的全部话题，则无需在每个话题上携带自己的分类
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
                user: true
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
    async getDiscussion({
        id,
        withFirstPost = true,
        withLastPost = true,
        withUser = true,
        withCategory = true
    }) {
        if (!id) return null;
        const queryCondition = {
            where: { id },
            include: {
                category: withCategory,
                firstPost: withFirstPost,
            }
        };
        if (withUser) queryCondition.include.user = { select: userModel.fields.simple };
        if (withLastPost) queryCondition.include.lastPost = {
            include: {
                user: { select: userModel.fields.simple }
            }
        };
        const d = await prisma.discussion.findUnique(queryCondition);
        if (!d) return null;

        // avoid n+1, load first post reactions and stats
        const refs = await prisma.PostReactionRef.groupBy({
            by: ['reactionId', 'postId'],
            where: {
                postId: d.firstPost.id
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
        d.firstPost.reactions = refs.map(r => {
            const reaction = reactions.find(re => re.id === r.reactionId);
            return {
                ...reaction,
                count: r._count.userId
            }
        });
        d.firstPost.reactions.sort((a, b) => b.count - a.count);
        return d;
    }
};

export const siteSettingsModel = {
    fields: {
        siteAbout: 'site_about',
    },
    async updateSettings(settings) {
        await prisma.$transaction(
            settings.map(s => prisma.siteSettings.update({
                where: { id: s.id },
                data: { value: s.value }
            }))
        );
    },
    async getSettings() {
        return await prisma.siteSettings.findMany();
    },
    async getFieldValue(field, defaultValue) {
        if (!field) return defaultValue;
        const item = await prisma.siteSettings.findUnique({ where: { key: field } });
        switch (item.dataType) {
            case 'text':
            case 'html':
                return item.value;
            case 'json':
                return JSON.parse(item.value);
            case 'number':
                return new Number(item.value);
            default:
                return defaultValue;
        }
    }
};
