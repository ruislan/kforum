import _ from 'lodash';
import { ModelError, userModel } from '@/models';
import rest from '@/lib/rest';
import logger from '@/lib/logger';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q');
    if (_.isEmpty(q)) return rest.ok({ data: [] });
    const query = {
        OR: [
            { name: { contains: q } },
            { bio: { contains: q } }
        ]
    };
    try {
        const { users, hasMore } = await userModel.getUsers({ query, page });
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