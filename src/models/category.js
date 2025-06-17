import _ from 'lodash';
import prisma from '@/lib/prisma';
import ModelError from './model-error';

const categoryModel = {
    errors: {
        SCHEMA_NAME: '名称是必填的，不小于 2 个字符，不大于 20 个字符',
        SCHEMA_SLUG: 'slug是必填的，只能为小写或数字，不小于 2 个字符，不大于 20 个字符',
        SCHEMA_SEQUENCE: '顺序只能是大于 0 的数字',
        UNIQUE_SLUG: 'slug 已经在使用中',
        CATEGORY_NOT_EMPTY: '该分类下还有话题',
    },
    fields: {
        simple: { id: true, name: true, slug: true, color: true, icon: true }
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

export default categoryModel;