import _ from 'lodash';
import { ModelError, discussionModel } from '@/models';
import rest from '@/lib/rest';
import logger from '@/lib/logger';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');

    if (_.isEmpty(q)) return rest.ok({ data: [] });

    try {
        const { discussions, hasMore } = await discussionModel.getDiscussions({
            queryTitle: q,
            withTags: true,
            isNewFirst: true,
            sort,
            page,
        });
        return rest.ok({ data: discussions, hasMore });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}