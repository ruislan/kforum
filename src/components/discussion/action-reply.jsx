'use client';
import { useSession } from 'next-auth/react';

import useLoginModal from '@/hooks/use-login-modal';
import { runIfFn } from '@/lib/fn';
import ActionButton from '../ui/action-button';
import { ReplyIcon } from '../icons';

export default function ActionReply({ post, onClick }) {
    const loginModal = useLoginModal();
    const { data } = useSession();
    return (
        <ActionButton onClick={e => {
            e.preventDefault();
            if (!data?.user) loginModal.open();
            else runIfFn(onClick)
        }}>
            <ReplyIcon />
        </ActionButton>
    );
}