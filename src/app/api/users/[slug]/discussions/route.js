import pageUtils from '@/lib/page-utils';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page');
    const name = params.slug;

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) return rest.ok({ data: [] });

    const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);

    const count = await prisma.discussion.count({ where: { userId: user.id } });
    const data = await prisma.discussion.findMany({
        where: { userId: user.id },
        include: {
            category: true,
            _count: {
                select: { posts: true },
            }
        },
        skip, take
    });
    data.forEach(d => {
        d.postCount = d._count.posts - 1; // sub first post;
        delete d._count;
    });
    return rest.ok({ data, hasMore: count > skip + take });
}