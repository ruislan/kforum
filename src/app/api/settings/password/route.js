import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import { userModel } from '@/lib/models';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();

    const { password, newPassword } = await request.json();
    if (!password || !newPassword) return rest.badRequest({ message: '缺少关键参数' }); // 这不是一个正常调用
    if (newPassword.length < 6) return rest.badRequest({ message: '密码长度不能小于6位', field: 'newPassword' });
    if (password === newPassword) return rest.badRequest({ message: '新密码和旧密码一致', field: 'newPassword' });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return rest.badRequest({ message: '用户不存在' });
    if (!userModel.comparePassword(password, user.password)) return rest.badRequest({ message: '密码错误' });
    await prisma.user.update({
        where: { id: user.id, },
        data: {
            password: userModel.hashPassword(newPassword)
        }
    });

    return rest.updated();
}