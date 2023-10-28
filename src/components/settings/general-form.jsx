'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import Input from '../ui/input';

export default function GeneralForm() {
    const { data, status } = useSession();
    const [email, setEmail] = useState(data.user?.email);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (status === 'loading') return <Spinner />;

    return (
        <form className='flex flex-col gap-4 text-neutral-200'>
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>用户名</h3>
                <span>{data.user.name}</span>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>邮箱</h3>
                <Input
                    type='email'
                    name='email'
                    autoComplete='email'
                    placeholder='邮箱'
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}