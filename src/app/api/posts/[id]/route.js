import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';

const handler = async function (request, params, method) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { discussion: true } });
    if (!post) return rest.badRequest({ message: '帖子不存在' });

    // check if user is admin or is owner
    const isAdmin = session.user.isAdmin;
    const isOwner = post.userId === session.user.id;
    if (!isAdmin && !isOwner) return rest.badRequest({ message: '帖子不存在' }); // 非正常调用，隐藏真实原因

    if (method === 'DELETE') {
        const isFirstPost = post.discussion.firstPostId === post.id;
        await prisma.$transaction(async tx => {
            await tx.$queryRaw`DELETE FROM PostReactionRef WHERE post_id = ${post.id}`; // delete reactions
            if (isFirstPost) { // delete all
                await tx.$queryRaw`DELETE FROM Post WHERE discussion_id = ${post.discussion.id}`;
                await tx.discussion.delete({ where: { id: post.discussion.id } });
            } else {
                await tx.post.delete({ where: { id: postId } }); // just delete one
            }
        });
        return rest.deleted();
    }
    if (method === 'PUT') {
        const { content, text } = await request.json();
        await prisma.post.update({ where: { id: postId }, data: { content, text } });
        return rest.updated();
    }
}

export async function PUT(request, { params }) {
    return handler(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
    return handler(request, params, 'DELETE');
}