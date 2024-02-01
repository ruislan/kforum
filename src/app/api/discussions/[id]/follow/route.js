import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import logger from '@/lib/logger';
import { ModelError, discussionModel } from '@/models';

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    const discussionId = Number(params.id) || 0;

    try {
        await discussionModel.follow({ user: session.user, discussionId, isFollowed: false });
        return rest.updated();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    const discussionId = Number(params.id) || 0;

    try {
        await discussionModel.follow({ user: session.user, discussionId, isFollowed: true });
        return rest.updated();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}