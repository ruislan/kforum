import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import { userModal } from '@/lib/models';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    let { avatar, gender, bio } = await request.json();
    if (!avatar) avatar = ''; // default user image

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return rest.badRequest({ message: '用户不存在' });
    await prisma.user.update({
        where: { id: user.id, },
        data: { avatar, gender, bio }
    });

    return rest.updated();
}