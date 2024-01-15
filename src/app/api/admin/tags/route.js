'use strict';
import _ from 'lodash';
import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import rest from '@/lib/rest';
import { ModelError, tagModel } from '@/models';

export async function GET(request, { params }) {
    // require admin or moderator
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin && !session?.user?.isModerator) return rest.notFound();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q') || '';

    const { tags, hasMore } = await tagModel.getTags({ page, query: q, });
    return rest.ok({ data: tags, hasMore });
}


export async function POST(request, { params }) {
    // require admin or moderator
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin && !session?.user?.isModerator) return rest.notFound();

    let { name, textColor, bgColor} = await request.json();
    name = _.trim(name);
    textColor = _.trim(textColor);
    bgColor = _.trim(bgColor);

    const validateResult = tagModel.validate({ name, textColor, bgColor });
    if (validateResult.error) return rest.badRequest({ message: validateResult.message });

    try {
        const newTag = await tagModel.create({ name, textColor, bgColor });
        return rest.created({ data: newTag.id });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}