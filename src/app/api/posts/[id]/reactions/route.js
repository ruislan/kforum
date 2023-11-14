import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';

// 获取这个帖子能够被使用的 reactions 和当前用户使用过的 reactions
export async function GET(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return rest.badRequest({ message: '帖子不存在' });

    const reactions = await prisma.reaction.findMany({
        orderBy: { position: 'asc' }
    });

    const userReactions = await prisma.reactionPostRef.findMany({
        where: {
            postId, userId: session.user.id
        }
    });
    return rest.ok({ data: { reactions, userReactions } });
}


export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const { id: reactionId, isReact } = await request.json();
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { discussion: true } });
    if (!post) return rest.badRequest({ message: '帖子不存在' });

    // update reaction
    await prisma.$transaction(async (tx) => {
        const data = { postId, reactionId, userId: session.user.id };
        const ref = await tx.reactionPostRef.findUnique({ where: { reactionId_postId_userId: data } });
        let inc = 0;
        if (isReact && !ref) {
            await tx.reactionPostRef.create({ data }); // 没有就创建一个
            inc = 1;
        }
        if (!isReact && ref) {
            await tx.reactionPostRef.delete({ where: { reactionId_postId_userId: data } }); // 有就删除
            inc = -1;
        }
        // isReact && ref 和 !isReact && !ref 这两个情况不用处理

        if (inc !== 0) { // 更新discussion
            await tx.discussion.update({
                where: { id: post.discussion.id },
                data: { reactionCount: { increment: inc } }
            });
        }
    });
    return rest.updated();
}