import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import logger from '@/lib/logger';
import rest from '@/lib/rest';
import { ModelError, categoryModel } from '@/lib/models';

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    let id = params.id;
    let { name, slug, sequence, description, color } = await request.json();

    id = Number(id) || 0;
    sequence = Number(sequence) || 0;

    const validateResult = categoryModel.validate({ name, slug, sequence, description, color });
    if (validateResult.error) return rest.badRequest({ message: validateResult.message });

    try {
        await categoryModel.update({ id, name, slug, sequence, description, color });
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


export async function DELETE(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    let id = params.id;
    id = Number(id) || 0;

    try {
        await categoryModel.delete({ id });
        return rest.deleted();
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}