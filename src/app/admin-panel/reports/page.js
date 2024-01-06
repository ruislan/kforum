import dynamicImport from 'next/dynamic';
const Reports = dynamicImport(() => import('@/components/admin-panel/reports'));

export default async function Page({ searchParams }) {
    return (
        <Reports filter={searchParams.filter ?? 'pending'} />
    );
}