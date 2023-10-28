import prisma from '@/lib/prisma';
import DiscussionListItem from './discussion-list-item';

async function getDiscussions({ category, isStickyFirst, skip, limit }) {
    const orderBy = []; // 注意 orderBy 的顺序
    if (isStickyFirst) orderBy.push({ isSticky: 'desc' }); // XXX 默认顺序下：SQLite 会将false放前面，因为False=0,True=1。其他 DB 可能会将True排前面。
    orderBy.push({ createdAt: 'desc' });

    const queryCondition = {
        skip, take: limit, orderBy,
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
            select: { id: true, name: true, slug: true, color: true, icon: true }
        };
    }

    const discussions = await prisma.discussion.findMany(queryCondition);
    discussions.forEach(d => {
        d.postCount = d._count.posts - 1; // sub first posts
        delete d._count;
    });

    return discussions;
}

// FIXME this component should be 'use client'
export default async function DiscussionList({ category = null, isStickyFirst = true }) {
    const discussions = await getDiscussions({ category, isStickyFirst, skip: 0, limit: 10 });
    return (
        <div className='flex flex-col gap-3'>
            {discussions.map((d, i) => <DiscussionListItem key={i} discussion={d} />)}
        </div>
    );
}
