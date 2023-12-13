import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, siteNavMenuModel } from '@/lib/models';
import _ from 'lodash';
import logger from '@/lib/logger';

export async function GET(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const data = await siteNavMenuModel.getMenus();
    return rest.ok({ data });
}

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const { menus } = await request.json();

    try {
        menus.forEach(m => m.sequence = (Number(m.sequence) || 0));
        await siteNavMenuModel.update({ menus });
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

