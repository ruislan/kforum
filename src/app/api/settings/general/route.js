import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const { email } = await request.json();
    if (!email || !/@/.test(email)) return rest.badRequest({ message: '邮件格式不正确' });

    const existsEmailCount = await prisma.user.count({
        where: {
            email,
            id: { not: session.user.id }  // 忽略掉自己的email
        }
    });
    if (existsEmailCount > 0) return rest.badRequest({ message: '该邮箱已经存在' });
    await prisma.user.update({
        where: { id: session.user.id, },
        data: { email }
    });
    return rest.updated();
}
