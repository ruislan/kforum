'use client';
import Box from './ui/box';
import Button from './ui/button';
import { useRouter } from 'next/navigation';

export default function UserActions() {
    const canCreateDiscussion = (Math.random() * 10) > 1;
    const router = useRouter();
    return (
        <Box className='flex flex-col gap-3'>
            <Button onClick={async (e) => {
                // await fetch('/api/discussions', {
                //     method: 'POST',
                //     body: JSON.stringify({ title: 'new title' }),
                //     headers: { 'Content-Type': 'application/json' },
                // });
                router.push('/d/create');
            }}
            // disabled={canCreateDiscussion}
            >发布新主题</Button>
        </Box>
    );
}
