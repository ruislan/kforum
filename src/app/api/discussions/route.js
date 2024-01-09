import { getServerSession } from 'next-auth';
import _ from 'lodash';

import rest from '@/lib/rest';
import authOptions from '@/lib/auth';
import { ModelError, discussionModel } from '@/models';
import logger from '@/lib/logger';
import { DISCUSSION_SORT } from '@/lib/constants';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const categoryId = Number(searchParams.get('categoryId')) || null;
    const tagId = Number(searchParams.get('tagId')) || null;
    const sort = DISCUSSION_SORT.find(c => c === searchParams.get('sort')) || DISCUSSION_SORT[0];
    const { discussions, hasMore } = await discussionModel.getDiscussions({
        categoryId, // 如果有categoryId说明是某个分类下面的全部话题，则无需在每个话题上携带自己的分类
        sort,
        tagId,
        isStickyFirst: !!categoryId || !!tagId,
        withFirstPost: true,
        page,
    });
    return rest.ok({ data: discussions, hasMore });
}

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    // parse body
    const { title, text, content, categorySlug, tags } = await request.json();

    // validate params
    const validateResult = discussionModel.validate({ title, text, content, categorySlug });
    if (validateResult.error) return rest.badRequest({ message: validateResult.message });

    try {
        const data = await discussionModel.create({
            user: session.user,
            title,
            content,
            text,
            tags,
            categorySlug,
            ip: request.ip
        });
        return rest.created({ data });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}