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

    const fetchCount = prisma.discussion.count({ where: { userId: user.id } });
    const fetchDiscussions = prisma.discussion.findMany({
        where: { userId: user.id },
        include: {
            category: true,
            _count: {
                select: { posts: true },
            }
        },
        skip, take
    });
    const [count, data] = await Promise.all([fetchCount, fetchDiscussions]);
    data.forEach(d => {
        d.postCount = d._count.posts - 1; // sub first post;
        delete d._count;
    });
    return rest.ok({ data, hasMore: count > skip + take });
}