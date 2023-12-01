import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { tagModel } from '@/lib/models';

const TagForm = dynamic(() => import('@/components/admin-panel/tags/tag-form'));

export default async function Page({ params }) {
    const id = Number(params.id);
    const tag = await tagModel.getTag({ id });
    if (!tag) notFound();
    return (
        <TagForm tag={tag} />
    );
}
