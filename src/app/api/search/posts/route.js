import { userModel } from '@/lib/models';
import pageUtils from '@/lib/page-utils';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page');
    const q = searchParams.get('q');
    const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);

    if (!q) return rest.ok({ data: [] });
    const condition = {
        content: { contains: q },
        replyPostId: { not: null }
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