import dynamicImport from 'next/dynamic';

const UserList = dynamicImport(() => import('@/components/admin-panel/users/user-list'));

export default async function Page() {
    return (
        <UserList />
    );
}
