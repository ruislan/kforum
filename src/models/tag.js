import prisma from '@/lib/prisma';
import pageUtils, { DEFAULT_PAGE_LIMIT } from '@/lib/page-utils';
import ModelError from './model-error';

const tagModel = {
    errors: {
        SCHEMA_NAME: '名称是必填的，不小于 2 个字符，不大于 20 个字符',
        UNIQUE_NAME: '已经存在的标签',
    },
    validate({ name }) {
        if (!name || name.length < 2 || name.length > 20) return { error: true, message: this.errors.SCHEMA_NAME };
        return { error: false };
    },
    async create({ name, textColor, bgColor }) {
        // check unique
        const exists = (await prisma.tag.count({ where: { name } })) > 0;
        if (exists) throw new ModelError(this.errors.UNIQUE_NAME);
        const newTag = await prisma.tag.create({ data: { name, textColor, bgColor } });
        return newTag;
    },
    async update({ id, name, textColor, bgColor }) {
        const exists = (await prisma.tag.count({
            where: {
                name,
                id: { not: id },
            }
        })) > 0;
        if (exists) throw new ModelError(this.errors.UNIQUE_NAME);
        await prisma.tag.update({
            where: { id },
            data: { name, textColor, bgColor }
        });
    },
    async delete({ id }) {
        await prisma.tag.delete({ where: { id } });
    },
    async getTag({
        id,
        name,
        withStats = false,
    }) {
        if (!id && !name) return null;

        const tag = await prisma.tag.findUnique({
            where: {
                id: id || undefined,
                name: name || undefined
            },
            include: {
                _count: withStats ?
                    { select: { discussions: true } } :
                    undefined
            }
        });
        if (tag && withStats) {
            tag.discussionCount = tag._count.discussions;
            delete tag._count;
        }
        return tag;
    },
    async getTags({
        query,
        ignoreIds,
        isHot = false,
        page = 1,
        pageSize = DEFAULT_PAGE_LIMIT
    }) {
        const skip = pageUtils.getSkip(page, pageSize);
        const take = pageSize;

        const whereClause = {
            name: { contains: query }
        };
        if (!_.isEmpty(ignoreIds)) whereClause.id = { notIn: ignoreIds };

        const fetchCount = prisma.tag.count({ where: whereClause });

        const fetchCondition = {
            where: whereClause,
            skip,
            take,
        };
        if (isHot) {
            fetchCondition.orderBy = {
                discussions: {
                    _count: 'desc'
                }
            };
        }
        const fetchList = prisma.tag.findMany(fetchCondition);

        let [tags, count] = await Promise.all([fetchList, fetchCount]);
        return { tags, hasMore: count > skip + take };
    }
};

export default tagModel;