import prisma from '@/lib/prisma';
import DiscussionItem from './discussion-item';

async function getDiscussions({ categorySlug, skip, limit }) {
    const queryCondition = {
        skip, take: limit,
        orderBy: [{ createdAt: 'desc' }],
        include: {
            user: true,
        }
    };

    if (categorySlug) {
        const category = await prisma.category.findUnique({ where: { slug: categorySlug }, select: { id: true } });
        queryCondition.where = { categoryId: category.id };
    }

    const discussions = await prisma.discussion.findMany(queryCondition);
    return discussions;
}

export default async function DiscussionList({ category = null }) {
    const discussions = await getDiscussions({ categorySlug: category, skip: 0, limit: 10 });
    return (
        <div className='flex flex-col gap-3'>
            {discussions.map((d, i) => <DiscussionItem key={i} d={d} />)}
        </div>
    );
}
