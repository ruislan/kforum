import { headers } from 'next/headers';
import logger from '@/lib/logger';
import rest from '@/lib/rest';
import { discussionModel, ModelError } from '@/models';

export async function POST() {
    const headerSecret = headers().get('x-secret');
    const secret = process.env.CRON_API_SECRET;
    if (headerSecret !== secret) return rest.notFound();

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
