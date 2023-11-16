import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { userModel } from '@/lib/models';
import _ from 'lodash';

export async function GET(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q') || '';

    const userParams = { page };
    if (!_.isEmpty(q)) {
        const id = Number(q) || 0;
        userParams.query = {
            OR: [{ id }, { name: { contains: q } }, { email: { contains: q } }]
        };
    }

    const { users, hasMore } = await userModel.getUsers(userParams);
    return rest.ok({ data: users, hasMore });
}