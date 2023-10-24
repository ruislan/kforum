'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import Button from '../ui/button';

export default function LoginForm() {
    const router = useRouter();
    const callbackUrl = useSearchParams().get('callbackUrl');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const resetFields = () => {
        setUsername('');
        setPassword('');
        setError(null);
    }

    const handleSubmit = async () => {
        if (isSubmitting || isSuccess) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });
            if (res.ok) {
                resetFields();
                setIsSuccess(true);
                router.replace(callbackUrl || '/');
            } else {
                setError('用户名或者密码错误');
            }
        } catch (err) {
            console.log(err);
            setError('未知错误，请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form className='flex flex-col' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <h2 className='text-2xl font-bold mb-4'>登陆</h2>
            <div className='text-sm mb-4'>
                欢迎回来👋。继续登录，即表示您同意我们的用户协议，并承认您理解隐私政策。
            </div>
            <div className='flex flex-col gap-2 mb-4 w-full'>
                <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                    <input type='text' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                        autoComplete='username' required
                        value={username} placeholder='邮箱或用户名' onChange={e => setUsername(e.target.value)} />
                </div>
                <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                    <input type='password' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                        autoComplete='current-password' required
                        value={password} placeholder='密码' onChange={e => setPassword(e.target.value)} />
                </div>
                {error && <span className='text-sm text-red-500'>{error}</span>}
            </div>
            <div className='w-full mb-4'><Button className='w-full' type='submit' disabled={isSubmitting || isSuccess} isLoading={isSubmitting || isSuccess}>登陆</Button></div>
            <div className='text-sm'>
                <span className='mr-1'>还没有账户?</span>
                <Link href='/register' className='underline underline-offset-4 cursor-pointer'>立即注册</Link>
            </div>
        </form>
    );
}