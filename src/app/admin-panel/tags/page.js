import dynamicImport from 'next/dynamic';
const TagList = dynamicImport(() => import('@/components/admin-panel/tags/tag-list'));

export default async function Page() {
    return (
        <TagList />
    );
}
