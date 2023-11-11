import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const discussionId = Number(params.id) || 0;
    const { isSticky } = await request.json();
    const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
    if (!discussion) return rest.badRequest({ message: '讨论不存在' });

    // check if user is admin or is owner
    const isAdmin = session.user.isAdmin;
    const isOwner = discussion.userId === session.user.id;
    if (!isAdmin && !isOwner) return rest.badRequest({ message: '讨论不存在' }); // 非正常调用，隐藏真实原因

    // update sticky
    await prisma.discussion.update({ where: { id: discussionId }, data: { isSticky } });
    return rest.updated();
}