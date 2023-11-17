import { discussionModel } from '@/lib/models';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const name = params.slug;

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) return rest.ok({ data: [] });

    const { discussions, hasMore } = await discussionModel.getDiscussions({
        userId: user.id,
        withFirstPost: false,
        withPoster: false,
        isStickyFirst: false,
        isNewFirst: true,
        page
    })

    return rest.ok({ data: discussions, hasMore });
}