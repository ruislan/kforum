import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { ModelError, discussionModel } from '@/models';
import rest from '@/lib/rest';
import logger from '@/lib/logger';

export async function POST() {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    try {
        const data = await discussionModel.updateHotnessScore();
        return rest.ok({ data });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}