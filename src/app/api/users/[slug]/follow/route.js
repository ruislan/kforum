import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import logger from '@/lib/logger';
import { ModelError, userModel } from '@/models';

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    const name = params.slug;

    try {
        await userModel.follow({
            user: session.user,
            followingUsername: name,
            isFollowing: false
        });
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

    const name = params.slug;

    try {
        await userModel.follow({
            user: session.user,
            followingUsername: name,
            isFollowing: true
        });
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
