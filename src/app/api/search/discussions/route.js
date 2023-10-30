import { userModel } from '@/lib/models';
import pageUtils from '@/lib/page-utils';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q');
    const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);

    if (!q) return rest.ok({ data: [] });
    const condition = {
        title: { contains: q },
    };
    const fetchCount = prisma.discussion.count({ where: condition });
    const fetchDiscussions = prisma.discussion.findMany({
        where: condition,
        include: {
            category: true,
            user: { select: userModel.fields.simple },
            _count: {
                select: { posts: true },
            }
        },
        orderBy: { createdAt: 'desc' },
        skip, take
    });
    const [count, data] = await Promise.all([fetchCount, fetchDiscussions]);
    data.forEach(d => {
        d.postCount = d._count.posts - 1; // sub first post;
        delete d._count;
    });
    return rest.ok({ data, hasMore: count > skip + take });
}