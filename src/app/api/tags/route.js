import { tagModel } from '@/models';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || '';
    const selected = searchParams.get('selected') || '';
    const ignoreIds = selected.split(',').map(id => Number(id)).filter(id => id > 0);
    const data = await tagModel.getTags({ query: q, ignoreIds, isHot: true });
    return rest.ok({ data: data.tags });
}