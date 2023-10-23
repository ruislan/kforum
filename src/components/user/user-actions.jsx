'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import useLoginModal from '@/hooks/useLoginModal';

import Box from '../ui/box';
import Button from '../ui/button';

export default function UserActions({ category }) {
    const { data } = useSession();
    const loginModal = useLoginModal();
    const router = useRouter();

    return (
        <Box className='flex flex-col gap-3'>
            <Button onClick={(e) => {
                e.preventDefault();
                if (!data?.user) {
                    loginModal.open();
                } else {
                    router.push(category ? `/d/create?c=${category.slug}` : '/d/create');
                }
            }}>发布新主题
            </Button>
        </Box>
    );
}
