import prisma from '@/lib/prisma';
import rest from '@/lib/rest';
import bcrypt from 'bcrypt';

export async function POST(request, { params }) {
    try {
        const { email, name, password } = await request.json();
        if (!email || !name || !password) return rest.badRequest({ message: 'Missing required fields' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (user) return rest.badRequest({ message: 'User already exists' });
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email, name, password: hashedPassword,
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&size=96`,
            }
        });
        delete newUser.password;
        return rest.ok({ data: newUser });
    } catch (err) {
        return rest.badRequest({ message: err.message });
    }
}