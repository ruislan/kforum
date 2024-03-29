import { getServerSession } from 'next-auth';

import rest from '@/lib/rest';
import authOptions from '@/lib/auth';
import logger from '@/lib/logger';
import { ModelError, bookmarkModel, postModel } from '@/models';

export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const discussionId = Number(searchParams.get('discussionId')) || null;
    const { posts, hasMore } = await postModel.getPosts({ discussionId, page, pageSize: 50 });

    // set current user's bookmark status
    if (!!session?.user) {
        const bookmarks = await bookmarkModel.getBookmarksByPosts({ userId: session.user.id, postIds: posts.map(post => post.id) });
        posts.forEach(post => post.isBookmarked = bookmarks.find(bookmark => bookmark.postId === post.id));
    }

    return rest.ok({ data: posts, hasMore });
}

export async function POST(request, { params }) {
    // require user
    const session = await getServerSession(authOptions);
    if (!session.user?.id) return rest.unauthorized();
    if (session.user?.isLocked) return rest.forbidden();

    // parse body
    const { content, text, discussionId, postId } = await request.json();

    // validate params
    const validateResult = postModel.validate({ text, content });
    if (validateResult.error) return rest.badRequest({ message: validateResult.message });

    try {
        const data = await postModel.create({
            user: session.user,
            content,
            text,
            discussionId,
            replyPostId: postId,
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