import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { reportModel } from '@/lib/models';
import _ from 'lodash';

export async function GET(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;

    // TODO 这里要获取全部，没有处理过的，处理过的，
    const { posts, hasMore } = await reportModel.getReportsGroupByPost({ page });
    return rest.ok({ data: posts, hasMore });
}