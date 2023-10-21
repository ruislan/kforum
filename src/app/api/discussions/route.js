import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function POST(request, { params }) {
    const { title, content, category } = await request.json();

    // validate params
    if (!title) return rest.badRequest({ message: '标题是必填项', field: 'title' });
    if (!content) return rest.badRequest({ message: '内容是必填项', field: 'content' });
    if (!category) return rest.badRequest({ message: '分类是必填项', field: 'category' });

    const data = await prisma.$transaction(async tx => {
        let discussion = await tx.discussion.create({
            data: {
                title, categoryId: 1, userId: 1, userCount: 1, postCount: 1,
            }
        });
        const post = await tx.post.create({
            data: {
                content, discussionId: discussion.id, type: 'text',
                userId: 1, ip: request.ip,
            }
        });
        discussion = await tx.discussion.update({
            where: { id: discussion.id },
            data: {
                firstPostId: post.id, lastPostId: post.id,
                lastPostedAt: new Date(), lastPostedUserId: post.userId,
            }
        });
        discussion.posts = [{ ...post }];
        return discussion;
    });

    return rest.ok({ data });
}