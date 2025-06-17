'use client';

import { SessionProvider } from 'next-auth/react';
import LockWatcher from './lock-watcher';

export default function Providers({ session, children }) {
    return (
        <SessionProvider session={session}>
            <LockWatcher />
            {children}
        </SessionProvider>
    );
}