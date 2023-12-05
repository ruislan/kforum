import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, discussionModel } from '@/lib/models';

export async function PUT(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const discussionId = Number(params.id) || 0;
    const { tags } = await request.json();

    try {
        await discussionModel.tagDiscussion({ user: session.user, id:discussionId, tags });
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