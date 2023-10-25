import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { discussion: true } });
    if (!post) return rest.badRequest({ message: '帖子不存在' });

    // check if user is admin or is owner
    const isAdmin = session.user.isAdmin;
    const isOwner = post.userId === session.user.id;
    console.log(isAdmin);
    console.log(isOwner);
    if (!isAdmin && !isOwner) return rest.badRequest({ message: '帖子不存在' }); // 非正常调用，隐藏真实原因

    // delete post
    const isFirstPost = post.discussion.firstPostId === post.id;
    await prisma.$transaction(async tx => {
        if (isFirstPost) { // delete all
            await tx.$queryRaw`DELETE FROM Post WHERE discussion_id = ${post.discussion.id}`;
            await tx.discussion.delete({ where: { id: post.discussion.id } });
        } else {
            await tx.post.delete({ where: { id: postId } }); // just delete one
        }
    });
    return rest.deleted();
}