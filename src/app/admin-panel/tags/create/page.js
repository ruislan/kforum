import dynamicImport from 'next/dynamic';
const TagForm = dynamicImport(() => import('@/components/admin-panel/tags/tag-form'));

export default async function Page() {
    return (
        <TagForm />
    );
}
