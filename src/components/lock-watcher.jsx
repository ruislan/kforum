'use client';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LockWatcher() {
    const { data } = useSession();
    useEffect(() => {
        (async () => {
            if (data?.user?.isLocked) {
                toast('你已经被管理员封禁');
                await signOut(); // redirect false
                // show modal , content, lock time,
                // then redirect to '/'
            }
        })();
    }, [data?.user?.isLocked]);

    return null;
}
