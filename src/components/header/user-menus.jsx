'use client';
import { useSession } from 'next-auth/react';

import useLoginModal from '@/hooks/use-login-modal';
import useRegisterModal from '@/hooks/use-register-modal';

import UserMenusDropdown from './user-menus-dropdown';

export default function UserMenus() {
    const { data } = useSession();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    return (
        <div className='flex items-center gap-4'>
            {!data?.user && (
                <>
                    <span onClick={() => loginModal.open()} className='cursor-pointer whitespace-nowrap transition-all text-neutral-400 hover:text-neutral-50 no-underline'>登陆</span>
                    <span onClick={() => registerModal.open()} className='cursor-pointer whitespace-nowrap transition-all text-neutral-400 hover:text-neutral-50 no-underline'>注册</span>
                </>
            )}
            <UserMenusDropdown user={data?.user} />
        </div>
    );
}