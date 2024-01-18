import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, bookmarkModel } from '@/models';
import logger from '@/lib/logger';

export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const { bookmarks, hasMore } = await bookmarkModel.getBookmarks({
        userId: session.user.id,
        page,
    });
    return rest.ok({ data: bookmarks, hasMore });
}

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const { postId } = await request.json();

    try {
        await bookmarkModel.create({ userId: session.user.id, postId });
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