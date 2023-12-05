import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';
import { ModelError, reportModel } from '@/lib/models';

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const { type, reason } = await request.json();
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { discussion: true } });
    if (!post) return rest.badRequest({ message: '帖子不存在' });

    try {
        await reportModel.create({ userId: session.user.id, postId: post.id, type, reason });
        return rest.created();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}