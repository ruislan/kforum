import prisma from '@/lib/prisma';
import DiscussionItem from './discussion-item';

async function getDiscussions({ category, skip, limit }) {
    const queryCondition = {
        skip, take: limit,
        orderBy: [{ createdAt: 'desc' }],
        include: {
            user: true,
            firstPost: true,
            _count: {
                select: { posts: true },
            }
        }
    };

    if (category) {
        queryCondition.where = { categoryId: category.id };
    } else {
        queryCondition.include.category = {
            select: {
                id: true, slug: true, name: true
            }
        };
    }

    const discussions = await prisma.discussion.findMany(queryCondition);
    return discussions;
}

export default async function DiscussionList({ category = null }) {
    const discussions = await getDiscussions({ category, skip: 0, limit: 10 });
    return (
        <div className='flex flex-col gap-3'>
            {discussions.map((d, i) => <DiscussionItem key={i} discussion={d} />)}
        </div>
    );
}
