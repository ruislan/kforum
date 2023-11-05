'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import Input from '../ui/input';

export default function GeneralForm({ user }) {
    const { status, update } = useSession();
    const [email, setEmail] = useState(user?.email);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const validateFields = () => {
        setError(null);
        return true;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateFields()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/settings/general', {
                method: 'PUT',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                update({ email });
                toast.success('保存成功');
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
                } else if (res.status === 401) {
                    setError('您的登录以过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            setError('未知错误，请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') return <Spinner />;
    if (!user) return null;

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                handleSubmit();
            }}
            className='flex flex-col gap-4 text-neutral-200'
        >
            <div className='flex flex-col gap-1'>
                <h2 className='font-bold'>用户名</h2>
                <span>{user.name}</span>
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-bold'>邮箱</h2>
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