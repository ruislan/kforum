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
        text: { contains: q }, // text字段存储的是纯内容，content包含json的字段
        id: { gt: 0 },
        // firstPostDiscussion: null, // all post, not just reply post
    };
    const fetchCount = prisma.post.count({ where: condition });
    const fetchPosts = prisma.post.findMany({
        where: condition,
        include: {
            user: {
                select: userModel.fields.simple
            },
            discussion: {
                include: {
                    category: true,
                    user: { select: userModel.fields.simple }
                }
            },
        },
        orderBy: { createdAt: 'desc' },
        skip, take
    });
    const [count, data] = await Promise.all([fetchCount, fetchPosts]);
    return rest.ok({ data, hasMore: count > skip + take });
}