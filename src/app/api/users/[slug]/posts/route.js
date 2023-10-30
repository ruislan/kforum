import { userModel } from '@/lib/models';
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

    const count = await prisma.post.count({ where: { userId: user.id } });
    const data = await prisma.post.findMany({
        where: {
            userId: user.id,
            replyPostId: { not: null }
        },
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
    return rest.ok({ data, hasMore: count > skip + take });
}