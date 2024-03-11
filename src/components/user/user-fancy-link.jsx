'use client';

import clsx from 'clsx';
import UserInfo from './user-info';

// show u/{username}
// when hover it ,show the user's info
export default function UserFancyLink({ user }) {
    if (!user) return null;
    return (
        <UserInfo user={user} />
    );
}
