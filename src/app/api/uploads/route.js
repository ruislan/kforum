import { getServerSession } from 'next-auth';

import rest from '@/lib/rest';
import authOptions from '@/lib/auth';
import { ModelError, uploadModel } from '@/models';
import logger from '@/lib/logger';

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    const data = await request.formData();
    const file = data.get('file');
    const checksum = data.get('checksum');

    try {
        const savedFile = await uploadModel.create({
            userId: session.user.id,
            file,
            checksum
        });
        return rest.created({
            data: {
                id: savedFile.id,
                userId: savedFile.userId,
                originalFileName: savedFile.originalFileName,
                url: savedFile.url,
                fileSize: savedFile.fileSize
            }
        });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}