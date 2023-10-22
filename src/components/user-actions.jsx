'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Box from './ui/box';
import Button from './ui/button';

export default function UserActions() {
    const { data } = useSession();
    const router = useRouter();

    return (
        <Box className='flex flex-col gap-3'>
            <Button onClick={async (e) => {
                if (!data?.user) {
                    alert('login first');
                } else {
                    router.push('/d/create');
                }
                // await fetch('/api/discussions', {
                //     method: 'POST',
                //     body: JSON.stringify({ title: 'new title' }),
                //     headers: { 'Content-Type': 'application/json' },
                // });
            }}
            // disabled={canCreateDiscussion}
            >发布新主题</Button>
        </Box>
    );
}
