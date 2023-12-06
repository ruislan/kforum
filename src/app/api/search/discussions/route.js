import _ from 'lodash';
import { ModelError, discussionModel } from '@/lib/models';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q');
    if (_.isEmpty(q)) return rest.ok({ data: [] });
    try {
        const { discussions, hasMore } = await discussionModel.getDiscussions({
            queryTitle: q,
            withTags: true,
            isNewFirst: true,
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