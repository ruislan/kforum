import _ from 'lodash';
import { ModelError, postModel } from '@/models';
import rest from '@/lib/rest';
import logger from '@/lib/logger';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q');
    if (_.isEmpty(q)) return rest.ok({ data: [] });
    try {
        const { posts, hasMore } = await postModel.getPosts({
            queryText: q,
            withReactions: false,
            withReplyPosts: false,
            isNewFirst: true,
            page,
        });
        return rest.ok({ data: posts, hasMore });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}