import { discussionModel } from '@/models';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1;
    const name = params.slug;

    const { discussions, hasMore } = await discussionModel.getUserDiscussions({
        username: name,
        page
    });

    return rest.ok({ data: discussions, hasMore });
}