import { postModel } from '@/models';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const name = params.slug;

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) return rest.ok({ data: [] });

    const { posts, hasMore } = await postModel.getUserReplyPosts({ userId: user.id, page })

    return rest.ok({ data: posts, hasMore });
}