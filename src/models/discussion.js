import prisma from '@/lib/prisma';
import { DISCUSSION_SORT, MIN_LENGTH_TITLE } from '@/lib/constants';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';
import userModel from './user';
import postModel from './post';
import uploadModel from './upload';

const discussionModel = {
    errors: {
        SCHEMA_TITLE: `标题是必填的，不小于 ${MIN_LENGTH_TITLE} 个字符。`,
        SCHEMA_CATEGORY: '分类是必填的，请选择一个分类',
        DISCUSSION_NOT_FOUND: '请指定要更新的话题',
        NO_PERMISSION: '没有操作权限',
    },
    async getDiscussions({
        // filter
        queryTitle = null, // 如果存在 queryTitle 则即是要进行模糊搜索
        categoryId = null, // 如果有categoryId，也即是进行分类过滤，那么无需在每个话题上携带分类 Join（都是这个分类）
        userId = null, // 如果有userId，也即是进行所有人过滤，那么无需在每个话题上携带用户 Join（都是这个人）
        tagId = null, // 如果有tagId，也即是根据标签进行过滤
        isDeleted = false,
        // page
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT,
        // sort
        sort, // 排序方式
        isStickyFirst = false,
        // include
        withTags = true,
        withPoster = true, // 带海报
        withFirstPost = false, // 带首贴
    }) {
        const orderBy = []; // 注意 orderBy 的顺序
        if (isStickyFirst) orderBy.push({ isSticky: 'desc' });
        if (sort === DISCUSSION_SORT[0]) orderBy.push({ hotnessScore: 'desc' });
        if (sort === DISCUSSION_SORT[1]) orderBy.push({ createdAt: 'desc' });

        const queryCondition = {
            where: {
                id: { gt: 0 },
                title: { contains: queryTitle || '' },
                userId: userId || undefined,
                categoryId: categoryId || undefined,
                tags: tagId ? { some: { tagId } } : undefined,
                deletedAt: isDeleted ? { not: null } : null,
            },
            orderBy,
            include: {
                firstPost: withFirstPost,
                poster: withPoster,
                tags: withTags ? { select: { tag: true } } : false,
                category: categoryId ? false : { select: { id: true, name: true, slug: true, color: true, icon: true } },
                user: userId ? false : { select: userModel.fields.simple },
            }
        };

        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;
        queryCondition.take = take;
        queryCondition.skip = skip;

        const countCondition = { where: queryCondition.where };
        const countFetch = prisma.discussion.count(countCondition);
        const discussionsFetch = prisma.discussion.findMany(queryCondition);
        const [discussions, count] = await Promise.all([discussionsFetch, countFetch]);

        if (withTags) {
            for (const d of discussions) {
                d.tags = d.tags.map(t => t.tag);
            }
        }

        return { discussions, hasMore: count > skip + take };
    },
    async incrementView({ id }) {
        await prisma.discussion.update({
            where: { id },
            data: {
                viewCount: { increment: 1 },
            }
        });
    },
    async getDiscussion({
        // filter
        id,
        isDeleted = false,
        // include
        withFirstPost = true,
        withLastPost = true,
        withUser = true,
        withCategory = true,
        withTags = true,
    }) {
        if (!id) return null;
        const queryCondition = {
            where: {
                id,
                deletedAt: isDeleted ? { not: null } : null,
            },
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
        if (withTags) queryCondition.include.tags = { select: { tag: true } };

        const d = await prisma.discussion.findUnique(queryCondition);
        if (!d) return null;

        // avoid n+1, load first post reactions and stats
        const refs = await prisma.reactionPostRef.groupBy({
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
        if (withTags) d.tags = d.tags.map(ref => ref.tag);

        return d;
    },
    validate({ title, text, content, categorySlug }) {
        if (!title || title.length < MIN_LENGTH_TITLE) return { error: true, message: this.errors.SCHEMA_TITLE };
        if (!categorySlug) return { error: true, message: this.errors.SCHEMA_CATEGORY };
        const result = postModel.validate({ text, content }); // validate post
        return result;
    },
    checkPermission(user, discussion) {
        const isAdmin = user.isAdmin;
        const isOwner = discussion.userId === user.id;
        // isModerator ...
        if (!isAdmin && !isOwner) return false;
        return true;
    },
    async create({ user, title, text, content, categorySlug, tags: tagIds, ip }) {
        const localUser = { ...user };
        const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
        if (!cat) throw new ModelError(this.errors.SCHEMA_CATEGORY);

        const images = uploadModel.getImageUrls(content);
        tagIds = tagIds?.slice(0, 5);

        const data = await prisma.$transaction(async tx => {
            let discussion = await tx.discussion.create({
                data: {
                    title,
                    categoryId: cat.id,
                    userId: localUser.id,
                }
            });
            // connect tag to discussion
            if (tagIds?.length > 0) {
                let tags = await tx.tag.findMany({
                    where: {
                        id: { in: tagIds },
                    }
                });
                const data = tags.map(t => ({ tagId: t.id, discussionId: discussion.id, userId: localUser.id }));
                await tx.tagDiscussionRef.createMany({
                    data,
                    skipDuplicates: true
                });
            }

            const post = await tx.post.create({
                data: {
                    content, text, discussionId: discussion.id, type: 'text',
                    userId: localUser.id, ip,
                }
            });

            let poster = null;
            // connect upload to post
            if (images?.length > 0) {
                const uploads = await tx.upload.findMany({ where: { url: { in: images } } });
                await tx.uploadPostRef.createMany({
                    data: uploads.map(u => ({
                        uploadId: u.id,
                        postId: post.id
                    }))
                });
                // first page is the poster
                poster = uploads[0];
            }

            discussion = await tx.discussion.update({
                where: { id: discussion.id },
                data: {
                    firstPostId: post.id,
                    lastPostId: post.id,
                    posterId: poster?.id, // maybe null
                }
            });

            discussion.posts = [{ ...post }];
            return discussion;
        });

        return data;
    },
    async tag({ user, id, tags: tagIds }) {
        const localUser = { ...user };
        const discussion = await prisma.discussion.findUnique({ where: { id } });
        if (!discussion) throw new ModelError(this.errors.DISCUSSION_NOT_FOUND);
        if (!this.checkPermission(localUser, discussion)) throw new ModelError(this.errors.NO_PERMISSION);

        tagIds = tagIds?.slice(0, 5);

        await prisma.$transaction(async tx => {
            await tx.tagDiscussionRef.deleteMany({
                where: {
                    discussionId: discussion.id,
                }
            });
            if (tagIds?.length > 0) {
                let tags = await tx.tag.findMany({
                    where: {
                        id: { in: tagIds },
                    }
                });
                const data = tags.map(t => ({ tagId: t.id, discussionId: discussion.id, userId: localUser.id }));
                await tx.tagDiscussionRef.createMany({
                    data,
                    skipDuplicates: true
                });
            }
        });
    },
    async lock({ user, discussionId, isLocked }) {
        const localUser = { ...user };
        const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
        if (!discussion) throw new ModelError(this.errors.DISCUSSION_NOT_FOUND);
        if (!this.checkPermission(localUser, discussion)) throw new ModelError(this.errors.NO_PERMISSION);

        await prisma.discussion.update({ where: { id: discussionId }, data: { isLocked } });
    },
    async sticky({ user, discussionId, isSticky }) {
        const localUser = { ...user };
        const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
        if (!discussion) throw new ModelError(this.errors.DISCUSSION_NOT_FOUND);
        if (!this.checkPermission(localUser, discussion)) throw new ModelError(this.errors.NO_PERMISSION);

        await prisma.discussion.update({ where: { id: discussionId }, data: { isSticky } });
    },
    async calculateHotnessScore({ createdAt, postCount, userCount, reactionCount, viewCount }) {
        const now = new Date();
        const age = (now - new Date(createdAt)) / 1000;
        const interactionHotness = postCount * 10 + reactionCount * 5 + viewCount; // 计算帖子的互动热度
        const userHotness = userCount * 2; // 计算帖子的用户热度
        const decayFactor = 1 / (age ** 0.5); // 衰减热度
        const hotness = Math.floor((interactionHotness + userHotness) * decayFactor * 10000);
        return hotness;
    },
    async updateHotnessScore() {
        // 更新 discussion 的分数
        // 将 7 天之内都没有动静或已经被删除的 discussion 得分都设置为 0，这些帖子已经完全冷掉了。
        // 7 天之内有动静的且没有删除的进行计算并批量更新。
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fadeCount = await prisma.discussion.updateMany({
            where: {
                AND: {
                    hotnessScore: { gt: 0 },
                    OR: [
                        { updatedAt: { lt: sevenDaysAgo } },
                        { deletedAt: { not: null } }
                    ]
                }

            },
            data: {
                hotnessScore: 0
            }
        });
        const discussions = await prisma.discussion.findMany({
            where: {
                updatedAt: { gte: sevenDaysAgo },
                deletedAt: null,
            }
        });
        for (const d of discussions) {
            const hotnessScore = await this.calculateHotnessScore({
                createdAt: d.createdAt,
                postCount: d.postCount,
                userCount: d.userCount,
                reactionCount: d.reactionCount,
                viewCount: d.viewCount,
            });
            d.hotnessScore = hotnessScore;
        }

        await prisma.$transaction(
            discussions
                .filter(d => d.hotnessScore > 0)
                .map(d => {
                    return prisma.discussion.update({
                        where: { id: d.id },
                        data: { hotnessScore: d.hotnessScore }
                    });
                })
        );

        return { fade: fadeCount.count, updated: discussions.length };
    }
};

export default discussionModel;