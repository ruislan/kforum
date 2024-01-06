import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { reportModel } from '@/models';
import _ from 'lodash';

export async function GET(request, { params }) {
    // require admin or moderator
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin && !session?.user?.isModerator) return rest.notFound();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const filter = searchParams.get('filter');

    const { posts, hasMore } = await reportModel.getReportsGroupByPost({ page, filter });
    return rest.ok({ data: posts, hasMore });
}