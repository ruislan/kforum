import Reports from '@/components/admin-panel/reports';

export default async function Page({ searchParams }) {
    return (
        <Reports filter={searchParams.filter ?? 'pending'} />
    );
}