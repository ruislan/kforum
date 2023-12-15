import prisma from '@/lib/prisma';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import userModel from './user';
import postModel from './post';
import ModelError from './model-error';

const reportModel = {
    errors: {
        TYPE_INVALID: '不支持的举报理由，建议选择“其他”，并说明举报原因',
        REASON_TOO_SHORT: '请说明举报的原因，至少 4 个字',
    },
    actions: {
        agree: 'agree',
        disagree: 'disagree',
    },
    types: { // 举报的分类
        SPAM: 'spam', // 偏离话题，与当前话题无关，口水贴、价值不高等
        RULES: 'rules', // 违反规则
        RUDELY: 'rudely', // 脏话、威胁、人身攻击等不当言论
        INFRINGEMENT: 'infringement', // 侵犯隐私、著作权等等
        OTHER: 'other', //其他
        includes(value) {
            return Object.values(this).includes(value);
        }
    },
    async create({ userId, postId, type, reason }) {
        if (!this.types.includes(type)) throw new ModelError(this.errors.TYPE_INVALID);
        if (type === this.types.OTHER && reason.length < 4) throw new ModelError(this.errors.REASON_TOO_SHORT);
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw new ModelError(postModel.errors.POST_NOT_FOUND);

        const report = await prisma.report.findFirst({ where: { userId, postId } });
        if (report) return; // 举报过了不用再次存储

        await prisma.report.create({
            data: { userId, postId, type, reason }
        });
    },
    async getReportsGroupByPost({
        filter,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT
    }) {
        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;

        let whereClause = {
            reports: {
                some: {
                }
            }
        };
        switch (filter) {
            case 'pending':
                whereClause.reports.some.ignored = null;
                break;
            case 'ignored':
                whereClause.reports.some.ignored = true;
                break;
            default: break;
        }

        // 这里主要是以帖子为主体的举报
        const fetchCount = prisma.post.count({ where: whereClause });
        const fetchList = prisma.post.findMany({
            where: whereClause,
            include: {
                user: {
                    select: userModel.fields.simple,
                },
                discussion: {
                    include: {
                        category: true,
                        user: {
                            select: userModel.fields.simple,
                        }
                    }
                },
                reports: {
                    include: {
                        user: {
                            select: userModel.fields.simple,
                        },
                        ignoredUser: {
                            select: userModel.fields.simple,
                        },
                    }
                },
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take,
            skip,
        });

        let [posts, count] = await Promise.all([fetchList, fetchCount]);
        return { posts, hasMore: count > skip + take };
    },
    async perform({ action, userId, reportIds }) {
        if (![this.actions.agree, this.actions.disagree].includes(action)) throw new ModelError('action not support');
        if (action === this.actions.agree) {
            const report = await prisma.report.findFirst({
                where: { id: reportIds[0] }
            });
            await postModel.delete({ id: report.postId, isBySystem: true });
        } else {
            await prisma.report.updateMany({
                where: {
                    id: {
                        in: reportIds,
                    }
                },
                data: {
                    ignoredUserId: userId,
                    ignoredAt: new Date(),
                    ignored: true,
                }
            });
        }
    }
}

export default reportModel;