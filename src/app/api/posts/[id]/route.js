import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, postModel } from '@/models';
import logger from '@/lib/logger';

const handler = async function (request, params, method) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    const postId = Number(params.id) || 0;

    try {
        if (method === 'DELETE') {
            await postModel.delete({ user: session.user, id: postId });
            return rest.deleted();
        }
        if (method === 'PUT') {
            const { content, text } = await request.json();
            const validateResult = postModel.validate({ text, content });
            if (validateResult.error) return rest.badRequest({ message: validateResult.message });
            await postModel.update({ user: session.user, id: postId, text, content });
            return rest.updated();
        }
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}

export async function PUT(request, { params }) {
    return handler(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
    return handler(request, params, 'DELETE');
}