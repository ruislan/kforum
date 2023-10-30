import { userModel } from '@/lib/models';
import pageUtils from '@/lib/page-utils';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const name = params.slug;

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) return rest.ok({ data: [] });

    const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);

    const whereClause = {
        userId: user.id,
        firstPostDiscussion: null, // just reply post
    }

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
        skip, take
    });
    const [count, data] = await Promise.all([fetchCount, fetchPosts]);
    return rest.ok({ data, hasMore: count > skip + take });
}