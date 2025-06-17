import authOptions from '@/lib/auth';
import { siteSettingModel } from '@/models';
import rest from '@/lib/rest';
import { getServerSession } from 'next-auth';

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();
    const { settings } = await request.json();
    try {
        await siteSettingModel.updateSettings(settings);
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