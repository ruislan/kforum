import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';
import { tagModel } from '@/models';

const TagForm = dynamicImport(() => import('@/components/admin-panel/tags/tag-form'));

export default async function Page({ params }) {
    const id = Number(params.id);
    const tag = await tagModel.getTag({ id });
    if (!tag) notFound();
    return (
        <TagForm tag={tag} />
    );
}
