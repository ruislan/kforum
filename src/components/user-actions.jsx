'use client';
import Box from './box';
import Button from './button';

export default function UserActions() {
    const canCreateDiscussion = (Math.random() * 10) > 1;
    return (
        <Box className='flex flex-col gap-3'>
            <Button onClick={async (e) => {
                await fetch('/api/discussions', {
                    method: 'POST',
                    body: JSON.stringify({ title: 'new title' }),
                    headers: { 'Content-Type': 'application/json' },
                });
            }}
            // disabled={canCreateDiscussion}
            >发布新主题</Button>
        </Box>
    );
}
