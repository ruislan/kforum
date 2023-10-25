import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import rest from '@/lib/rest';
import authOptions from '@/lib/auth';

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    // parse body
    const { content, discussionId, postId } = await request.json();

    // validate params
    if (!content || content.length < 1) return rest.badRequest({ message: '回复内容是必填项', field: 'content' });
    if (!discussionId) return rest.badRequest({ message: '回复的主贴已经删除或不存在', field: 'discussionId' });

    // discussion must exist
    const discussion = await prisma.discussion.findUnique({ where: { id: discussionId } });
    if (!discussion) return rest.badRequest({ message: '回复的主贴已经删除或不存在', field: 'discussionId' });

    // does it reply to a post?
    let post;
    if (postId) {
        post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return rest.badRequest({ message: '回复的帖子已经删除或不存在', field: 'postId' });
    }


    // 检查用户是否已经发过帖子
    const sessionUserPost = await prisma.post.findFirst({
        where: {
            discussionId,
            userId: session.user.id
        }
    });

    const data = await prisma.$transaction(async tx => {
        const post = await tx.post.create({
            data: {
                content, discussionId, type: 'text',
                userId: session.user.id, ip: request.ip,
                replyPostId: postId
            }
        });
        const updateData = {
            lastPostId: post.id,
            lastPostedAt: new Date(),
        };
        if (!sessionUserPost) updateData.userCount = { increment: 1 };
        await tx.discussion.update({
            where: { id: discussion.id },
            data: updateData
        });
        post.user = session.user;
        return post;
    });

    return rest.created({ data });
}