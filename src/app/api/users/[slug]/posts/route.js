import { postModel } from '@/models';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const name = params.slug;
    const { posts, hasMore } = await postModel.getUserReplyPosts({ username: name, page })
    return rest.ok({ data: posts, hasMore });
}