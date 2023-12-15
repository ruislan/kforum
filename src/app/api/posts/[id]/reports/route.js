import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import prisma from '@/lib/prisma';
import { ModelError, reportModel } from '@/models';
import logger from '@/lib/logger';

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const postId = Number(params.id) || 0;
    const { type, reason } = await request.json();

    try {
        await reportModel.create({ userId: session.user.id, postId, type, reason });
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