import { headers } from 'next/headers';
import logger from '@/lib/logger';
import rest from '@/lib/rest';
import { uploadModel, ModelError } from '@/models';

export async function POST() {
    const headerSecret = headers().get('x-secret');
    const secret = process.env.CRON_API_SECRET;
    if (headerSecret !== secret) return rest.notFound();
    try {
        logger.info('cleaning unused uploaded files...');
        const data = await uploadModel.cleanup();
        logger.info(`cleaned ${data.count}, size ${data.size}`);
        return rest.ok();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}
