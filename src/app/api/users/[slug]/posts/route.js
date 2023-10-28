import { userModal } from '@/lib/models';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page');
    const name = params.slug;

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) return rest.ok({ data: [] });

    const take = 10;
    const skip = Math.max(0, page - 1) * take;

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
                    user: { select: userModal.fields.simple }
                }
            },
        },
        skip, take
    });
    return rest.ok({ data, hasMore: count > skip + take });
}