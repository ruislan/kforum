import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, discussionModel } from '@/models';
import logger from '@/lib/logger';

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const discussionId = Number(params.id) || 0;
    const { isSticky } = await request.json();

    try {
        await discussionModel.sticky({ user: session.user, discussionId, isSticky });
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