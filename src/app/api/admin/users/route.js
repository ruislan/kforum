import _ from 'lodash';
import { getServerSession } from 'next-auth';

import { ModelError, userModel } from '@/lib/models';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import logger from '@/lib/logger';

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
    try {
        const { users, hasMore } = await userModel.getUsers(userParams);
        return rest.ok({ data: users, hasMore });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}