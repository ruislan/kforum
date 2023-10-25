import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import rest from '@/lib/rest';
import authOptions from '@/lib/auth';


export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    // parse body
    const { title, text, content, categorySlug } = await request.json();

    // validate params
    if (!title || title.length < 1) return rest.badRequest({ message: '标题是必填项', field: 'title' });
    if (!content || content.length < 1 || !text || text.length < 1) return rest.badRequest({ message: '内容是必填项', field: 'content' });
    if (!categorySlug) return rest.badRequest({ message: '分类是必填项', field: 'categorySlug' });

    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });

    if (!cat) return rest.badRequest({ message: '分类不存在', field: 'category' });

    const data = await prisma.$transaction(async tx => {
        let discussion = await tx.discussion.create({
            data: {
                title, categoryId: cat.id, userId: session.user.id,
            }
        });
        const post = await tx.post.create({
            data: {
                content, text, discussionId: discussion.id, type: 'text',
                userId: session.user.id, ip: request.ip,
            }
        });

        discussion = await tx.discussion.update({
            where: { id: discussion.id },
            data: { firstPostId: post.id, lastPostId: post.id }
        });

        discussion.posts = [{ ...post }];
        return discussion;
    });

    return rest.created({ data });
}