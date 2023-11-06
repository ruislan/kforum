import authOptions from '@/lib/auth';
import { siteSettingsModel } from '@/lib/models';
import rest from '@/lib/rest';
import { getServerSession } from 'next-auth';

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();
    const { settings } = await request.json();
    await siteSettingsModel.updateSettings(settings);
    return rest.updated();
}