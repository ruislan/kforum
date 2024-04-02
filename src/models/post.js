import prisma from '@/lib/prisma';
import { MIN_LENGTH_CONTENT, NOTIFICATION_TYPES, REPUTATION_TYPES } from '@/lib/constants';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';
import userModel from './user';
import uploadModel from './upload';
import notificationModel from './notification';

const postModel = {
    errors: {
        SCHEMA_CONTENT: `内容是必填的，不小于 ${MIN_LENGTH_CONTENT} 个字符。`,
        DISCUSSION_NOT_FOUND: '请指定要回复的话题',
        DISCUSSION_IS_LOCKED: '话题已经被锁定',
        REPLY_TO_POST_NOT_FOUND: '回复的帖子已经删除或不存在',
        POST_NOT_FOUND: '请指定要更新的帖子',
        NO_PERMISSION: '没有操作权限',
    },
    validate({ text, content }) {
        if (content?.length < MIN_LENGTH_CONTENT) return { error: true, message: this.errors.SCHEMA_CONTENT };
        const hasImage = ((input) => {
            try {
                return JSON.parse(input).content?.some(node => node.type === 'image');
            } catch (err) {
                return false;
            }
        })(content);
        if (!hasImage && text?.length < MIN_LENGTH_CONTENT) return { error: true, message: this.errors.SCHEMA_CONTENT };
        return { error: false };
    },
    checkPermission(user, post) {
        const isAdmin = user.isAdmin;
        const isModerator = user.isModerator;
        const isOwner = post.userId === user.id;
        if (!isAdmin && !isModerator && !isOwner) return false;
        return true;
    },
    async create({
        user,
        content,
        text,
        discussionId,
        replyPostId,
        ip
    }) {
        const localUser = { ...user };
        const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
        if (!discussion) throw new ModelError(this.errors.DISCUSSION_NOT_FOUND);
        if (discussion.isLocked) throw new ModelError(this.errors.DISCUSSION_IS_LOCKED);

        // 是否回复回帖?
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
                userId: localUser.id
            }
        });

        const data = await prisma.$transaction(async tx => {
            const post = await tx.post.create({
                data: {
                    content,
                    text,
                    discussionId,
                    type: 'text',
                    userId: localUser.id,
                    ip,
                    replyPostId
                }
            });

            // connect upload to post
            const images = uploadModel.getImageUrls(content);
            if (images?.length > 0) {
                const uploads = await tx.upload.findMany({ where: { url: { in: images } } });
                await tx.uploadPostRef.createMany({
                    data: uploads.map(u => ({
                        uploadId: u.id,
                        postId: post.id
                    }))
                });
            }

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

        // add reputation
        // XXX 思考一下，如果是回帖，这里是否应该给目标贴的发布者增加声望
        // 自己回帖自己的话题，不能进行加分
        if (localUser.id !== discussion.userId) {
            await userModel.updateReputation({
                userId: discussion.userId,
                type: REPUTATION_TYPES.POST_CREATED
            });
        }

        // add ref
        data.user = localUser;
        data.replyPost = replyPost;

        // send async notification
        await pubsub.emit('notification', {
            type: NOTIFICATION_TYPES.NEW_POST,
            data: {
                user: localUser,
                post: {
                    ...data,
                    discussion,
                }
            }
        });

        return data;
    },
    async update({ user, id, content, text }) {
        const localUser = { ...user };
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) throw new ModelError(this.errors.POST_NOT_FOUND);
        if (!this.checkPermission(localUser, post)) throw new ModelError(this.errors.NO_PERMISSION);

        // 检查 upload 的引用情况
        const images = uploadModel.getImageUrls(content);
        await prisma.$transaction(async tx => {
            await tx.uploadPostRef.deleteMany({ where: { postId: post.id } });
            if (images?.length > 0) {
                const uploads = await tx.upload.findMany({ where: { url: { in: images } } });
                await tx.uploadPostRef.createMany({
                    data: uploads.map(u => ({
                        uploadId: u.id,
                        postId: post.id
                    }))
                });
            }
            await tx.post.update({
                where: { id },
                data: {
                    content,
                    text,
                    lastUpdatedUserId: localUser.id,
                    lastUpdatedAt: new Date()
                }
            });
        });
    },
    /**
     * 帖子的删除：
     *  帖子的删除都是软删除。
     *  无需删除帖子与反馈的链接，因为帖子将无法读取，所以反馈也无需读取。
     *  无需删除帖子与图片的链接，因为帖子将无法读取，所以图片也无需读取。
     *  TODO 帖子删除后，帖子无法被查看，除非管理员，可以在后台查看已经删除的帖子和主题。
    */
    async delete({
        user,
        id,
        isBySystem = false
    }) {
        const localUser = { ...user };
        const post = await prisma.post.findUnique({ where: { id }, include: { discussion: true } });
        if (!post) throw new ModelError(this.errors.POST_NOT_FOUND);
        if (!isBySystem && !this.checkPermission(localUser, post)) throw new ModelError(this.errors.NO_PERMISSION);

        const isFirstPost = post.discussion.firstPostId === post.id;
        const isLastPost = post.discussion.lastPostId === post.id;
        const isSticky = post.discussion.isSticky;
        await prisma.$transaction(async tx => {
            // 真实删除，将会清空所有的反馈
            const deletedAt = new Date();
            if (isFirstPost) {
                // 首贴删除将会同时删除所有的discussion
                // 如果是真实删除，那么所有话题的帖子的图片、反馈、举报等引用会级联删除
                // 软删除，首贴不用减去反馈数量，因为话题整个已经被删除了。
                await tx.post.updateMany({ where: { discussionId: post.discussion.id }, data: { deletedAt, deletedUserId: localUser.id } });
                // 这里不仅是要设置为删除，同时要将置顶取消
                await tx.discussion.update({ where: { id: post.discussion.id }, data: { deletedAt, deletedUserId: localUser.id, isSticky: false } });
            } else {
                // 如果是真实删除，此贴的图片、反馈、举报等引用会级联删除
                await tx.post.update({ where: { id: post.id }, data: { deletedAt, deletedUserId: localUser.id } });
                let lastPost = null;
                if (isLastPost) { // 查找新的最后一贴，并设置
                    lastPost = await tx.post.findFirst({ where: { discussionId: post.discussionId }, orderBy: { createdAt: 'desc' } });
                }
                // 软删除，非首贴需要减去反馈数量，如果恢复了删帖反馈数量需要加回来
                const reactionCount = await tx.reactionPostRef.count({ where: { postId: post.id } });
                await tx.discussion.update({
                    where: { id: post.discussionId },
                    data: {
                        lastPostId: lastPost?.id,
                        lastPostedAt: lastPost?.createdAt,
                        postCount: { increment: -1 },
                        reactionCount: { increment: -reactionCount },
                    }
                });

            }
        });

        // remove reputation
        // 如果是首贴，则需要计算删除了多少个帖子，然后进行统一扣分
        let count = 1;
        if (isFirstPost) {
            count = await prisma.post.count({
                where: {
                    deletedAt: { not: null },
                    userId: { not: post.discussion.userId },
                }
            });
            // console.log(isFirstPost);
            // console.log(count);
            // console.log(post.discussion.isSticky);
            if (isSticky) { // 如果之前是置顶状态，那么还要减去置顶
                await userModel.updateReputation({
                    userId: post.discussion.userId,
                    type: REPUTATION_TYPES.DISCUSSION_UNSTICKY,
                });
            }
        }
        await userModel.updateReputation({
            userId: post.discussion.userId,
            type: REPUTATION_TYPES.POST_DELETED,
            times: count,
        });
    },
    async getPost({ id }) {
        const post = await prisma.post.findUnique({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                user: { select: userModel.fields.simple },
                replyPost: {
                    include: {
                        user: { select: userModel.fields.simple }
                    }
                }
            }
        });
        // load reactions
        const refs = await prisma.reactionPostRef.groupBy({
            by: ['reactionId', 'postId'],
            where: {
                postId: post.id
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
        post.reactions = refs.map(r => {
            const reaction = reactions.find(re => re.id === r.reactionId);
            return {
                ...reaction,
                count: r._count.userId
            }
        });
        post.reactions.sort((a, b) => b.count - a.count);

        // handle deleted reply
        if (post.replyPost && post.replyPost.deletedAt) {
            post.replyPost.content = '';
            post.replyPost.text = '';
        }
        return post;
    },
    async getPosts({
        queryText,
        discussionId, // 如果有discussionId说明是某个话题下面的回帖
        isNewFirst = false,
        withUser = true,
        withReactions = true,
        withReplyPosts = true,
        isDeleted = false,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT
    }) {
        const queryCondition = {
            where: {
                discussionId: discussionId || { gt: 0 }, // 没有discussionId，就用 discussionId作为 index
                firstPostDiscussion: discussionId ? null : undefined, // 有discussionId则表示要去掉首贴，XXX 后面如果追加字段post_number可以直接用post_number > 1，效率会更快
                text: { contains: queryText || '' },
                deletedAt: isDeleted ? { not: null } : null,
            },
            orderBy: {
                createdAt: isNewFirst ? 'desc' : undefined
            },
            include: {
                user: withUser ? { select: userModel.fields.simple } : false,
                replyPost: withReplyPosts ? {
                    include: {
                        user: { select: userModel.fields.simple }
                    }
                } : false,
                discussion: discussionId ? false : {
                    include: {
                        category: true,
                        user: { select: userModel.fields.simple }
                    }
                }
            }
        };

        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;
        queryCondition.take = take;
        queryCondition.skip = skip;

        const fetchCount = prisma.post.count({ where: queryCondition.where });
        const fetchPosts = await prisma.post.findMany(queryCondition);
        let [posts, count] = await Promise.all([fetchPosts, fetchCount]);

        for (const post of posts) {
            // handle deleted reply
            if (post.replyPost && post.replyPost.deletedAt) {
                post.replyPost.content = '';
                post.replyPost.text = '';
            }
        }

        if (withReactions) {
            // avoid n + 1, batch load Posts reactions and reaction stats;
            const postIds = posts.map(p => p.id);
            const refs = await prisma.reactionPostRef.groupBy({
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
        }
        return { posts, hasMore: count > skip + take };
    },
    async getUserReplyPosts({
        username,
        isDeleted = false,
        isNewFirst = true,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT
    }) {
        const user = await prisma.user.findUnique({
            where: {
                name: username
            },
            select: {
                id: true,
                name: true
            }
        });
        if (!user) return { posts: [], hasMore: false };

        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;

        const whereClause = {
            userId: user.id,
            firstPostDiscussion: null, // 只有回帖不包含主贴
            deletedAt: isDeleted ? { not: null } : null,
        };

        const fetchCount = prisma.post.count({ where: whereClause });
        const fetchPosts = prisma.post.findMany({
            where: whereClause,
            include: {
                discussion: {
                    include: {
                        category: true,
                        user: { select: userModel.fields.simple }
                    }
                },
            },
            orderBy: [{ createdAt: isNewFirst ? 'desc' : 'asc' }],
            skip, take
        });
        let [posts, count] = await Promise.all([fetchPosts, fetchCount]);
        return { posts, hasMore: count > skip + take };
    },
    async reaction({
        user,
        postId,
        reactionId,
        isReact // true:react, false: unreact
    }) {
        const localUser = { ...user };
        const post = await prisma.post.findUnique({ where: { id: postId }, include: { discussion: true } });
        if (!post) throw new ModelError(this.errors.POST_NOT_FOUND);

        const inc = await prisma.$transaction(async (tx) => {
            const data = { postId, reactionId, userId: localUser.id };
            const ref = await tx.reactionPostRef.findUnique({ where: { reactionId_postId_userId: data } });
            let inc = 0;
            if (isReact && !ref) {
                await tx.reactionPostRef.create({ data }); // 没有就创建一个
                inc = 1;
            }
            if (!isReact && ref) {
                await tx.reactionPostRef.delete({ where: { reactionId_postId_userId: data } }); // 有就删除
                inc = -1;
            }
            // isReact && ref 和 !isReact && !ref 这两个情况不用处理

            if (inc !== 0) { // 更新 discussion 的反馈数量
                await tx.discussion.update({
                    where: { id: post.discussion.id },
                    data: { reactionCount: { increment: inc } }
                });
            }
            return inc;
        });

        // 如果inc增加了，说明多了反馈，则给 post 的作者加声望
        // 否则，则给作者减声望
        // 自己给自己的帖子反馈是不能增加声望的
        if (localUser.id !== post.userId && inc !== 0) {
            await userModel.updateReputation({
                userId: post.userId,
                type: inc > 0 ? REPUTATION_TYPES.REACTION_CREATED : REPUTATION_TYPES.REACTION_DELETED
            });
        }
    }
};

export default postModel;
