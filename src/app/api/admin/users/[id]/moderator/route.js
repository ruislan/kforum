import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, userModel } from '@/models';
import logger from '@/lib/logger';

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const userId = Number(params.id) || 0;
    const { isModerator } = await request.json();
    try {
        await userModel.updateModerator({ userId, isModerator });
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