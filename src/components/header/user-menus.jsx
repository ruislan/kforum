'use client';
import { useSession } from 'next-auth/react';

import LoginDialog from '@/components/login-dialog';
import RegisterDialog from '@/components/register-dialog';

import UserPopupMenus from './user-popup-menus';

export default function UserMenus() {
    const { data } = useSession();
    return (
        <div className='flex items-center gap-4'>
            {!data?.user && (
                <>
                    <LoginDialog />
                    <RegisterDialog />
                </>
            )}
            <UserPopupMenus />
        </div>
    );
}