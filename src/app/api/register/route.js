import { userModel } from '@/lib/models';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function POST(request, { params }) {
    try {
        const { email, name, password } = await request.json();
        if (!email || !name || !password) return rest.badRequest({ message: '注册信息不完整，请检查您的注册信息' });

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { name }
                ]
            }
        });
        if (user) return rest.badRequest({ message: '用户已经存在' });
        const hashedPassword = userModel.hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                email, name, password: hashedPassword,
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&size=96`,
            }
        });
        delete newUser.password;
        return rest.created();
    } catch (err) {
        return rest.badRequest({ message: err.message });
    }
}