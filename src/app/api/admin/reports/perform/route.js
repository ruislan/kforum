import _ from 'lodash';
import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, reportModel } from '@/lib/models';

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const { action, reportIds, } = await request.json();

    try {
        await reportModel.perform({ action, userId: session.user.id, reportIds });
        return rest.updated();
    } catch (err) {
        if (err instanceof ModelError) {
            return rest.badRequest({ message: err.message });
        } else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}