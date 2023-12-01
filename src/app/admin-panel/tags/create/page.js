import dynamic from 'next/dynamic';
const TagForm = dynamic(() => import('@/components/admin-panel/tags/tag-form'));

export default async function Page() {
    return (
        <TagForm />
    );
}
