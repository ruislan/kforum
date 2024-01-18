import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, bookmarkModel } from '@/models';
import logger from '@/lib/logger';

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const bookmarkId = Number(params.id) || 0;

    try {
        await bookmarkModel.delete({ userId: session.user.id, bookmarkId });
        return rest.deleted();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}