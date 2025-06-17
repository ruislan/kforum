import { getServerSession } from 'next-auth';

import { bookmarkModel } from '@/models';
import rest from '@/lib/rest';
import authOptions from '@/lib/auth';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const name = params.slug;
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked || session.user.name !== name) return rest.forbidden();

    const { bookmarks, hasMore } = await bookmarkModel.getUserBookmarks({ username: name, page })

    return rest.ok({ data: bookmarks, hasMore });
}