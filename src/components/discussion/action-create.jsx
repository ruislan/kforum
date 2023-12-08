'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import useLoginModal from '@/hooks/useLoginModal';

import Button from '../ui/button';

export default function ActionCreate({ category }) {
    const { data } = useSession();
    const loginModal = useLoginModal();
    const router = useRouter();

    return (
        <Button onClick={(e) => {
            e.preventDefault();
            if (!data?.user) {
                loginModal.open();
            } else {
                router.push(category ? `/d/create?c=${category.slug}` : '/d/create');
            }
        }}>发布新话题
        </Button>
    );
}
