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
        OR: [
            { name: { contains: q } },
            { bio: { contains: q } }
        ]
    };
    const fetchCount = prisma.user.count({ where: condition });
    const fetchUsers = prisma.user.findMany({
        where: condition,
        skip, take
    });
    const [count, data] = await Promise.all([fetchCount, fetchUsers]);
    return rest.ok({ data, hasMore: count > skip + take });
}