import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    const { title } = await request.json();
    const data = await prisma.$transaction(async tx => {
        let discussion = await tx.discussion.create({
            data: {
                title, categoryId: 1, userId: 1, userCount: 1, postCount: 1,
            }
        });
        const post = await tx.post.create({
            data: {
                content: 'hello', discussionId: discussion.id, type: 'text',
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
        { discussion, post };
    });

    return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}