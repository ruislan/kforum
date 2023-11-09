import { userModel } from '@/lib/models';
import UserList from '@/components/admin-panel/user-list';

async function getUsers() {
    return userModel.getUsers({ page: 1, ignoreSensitive: true });
}

export default async function Page() {
    const { users, hasMore } = await getUsers();
    return (
        <UserList users={users} hasMore={hasMore} />
    );
}
