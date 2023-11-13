import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, userModel } from '@/lib/models';
import logger from '@/lib/logger';

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const data = await request.formData();
    const file = data.get('file');
    const checksum = data.get('checksum');

    try {
        const user = await userModel.updateAvatar({
            userId: session.user.id,
            file,
            checksum
        });
        return rest.created({ data: user.avatarUrl });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}