'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import Input from '../ui/input';
import FormControl from '../ui/form-control';

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
                    setError('您的登录已过期，请重新登录');
                } else if (res.status === 403) {
                    toast.error('您没有权限进行此操作');
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
            className='flex flex-col gap-4 text-gray-100'
        >
            <FormControl title='用户名'>
                <span>{user.name}</span>
            </FormControl>
            <FormControl title='邮箱' subtitle='请谨慎修改邮箱'>
                <Input
                    type='email'
                    name='email'
                    autoComplete='email'
                    placeholder='邮箱'
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </FormControl>
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}