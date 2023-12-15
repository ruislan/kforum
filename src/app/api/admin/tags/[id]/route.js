import _ from 'lodash';
import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import logger from '@/lib/logger';
import rest from '@/lib/rest';
import { ModelError, tagModel } from '@/models';

export async function PUT(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    let id = params.id;
    let { name, textColor, bgColor } = await request.json();

    id = Number(id) || 0;
    name = _.trim(name);
    textColor = _.trim(textColor);
    bgColor = _.trim(bgColor);

    const validateResult = tagModel.validate({ name, textColor, bgColor });
    if (validateResult.error) return rest.badRequest({ message: validateResult.message });

    try {
        await tagModel.update({ id, name, textColor, bgColor });
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
        await tagModel.delete({ id });
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