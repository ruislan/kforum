import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';
import storage from '@/lib/storage';

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const data = await request.formData();
    const file = data.get('file');

    if (!file) return rest.badRequest({ message: 'no image' });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const avatar = await storage.store(file.name, buffer);

    await prisma.user.update({
        where: { id: session.user.id, },
        data: { avatar }
    });

    return rest.created({ data: avatar });
}