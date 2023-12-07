import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';
import { postModel } from '@/lib/models';

// 获取这个帖子能够被使用的 reactions 和当前用户使用过的 reactions
export async function GET(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return rest.badRequest({ message: '帖子不存在' });

    const fetchReactions = prisma.reaction.findMany({
        orderBy: { position: 'asc' }
    });

    const fetchUserReactions = prisma.reactionPostRef.findMany({
        where: {
            postId, userId: session.user.id
        }
    });

    const [reactions, userReactions] = await Promise.all([fetchReactions, fetchUserReactions]);
    return rest.ok({ data: { reactions, userReactions } });
}


export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const { id: reactionId, isReact } = await request.json();

    try {
        await postModel.reaction({ user: session.user, postId: postId, reactionId, isReact });
        return rest.updated();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}