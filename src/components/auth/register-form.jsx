'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '../ui/button';

export default function RegisterForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const resetFields = () => {
        setName('');
        setPassword('');
        setEmail('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, name, password, }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                resetFields();
                router.push('/login');
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
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

    return (
        <form className='flex flex-col' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <h2 className='text-2xl font-bold mb-4'>注册</h2>
            <div className='text-sm mb-4'>
                欢迎加入👏。继续注册，即表示您同意我们的用户协议，并承认您理解隐私政策。
            </div>
            <div className='flex flex-col gap-2 mb-4 w-full'>
                <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                    <input type='email' placeholder='邮箱' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                        autoComplete='email' required value={email} onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                    <input type='text' placeholder='用户名' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                        autoComplete='username' required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                    <input type='password' placeholder='密码' className='w-full h-7 text-neutral-200 bg-transparent outline-none'
                        autoComplete='current-password' required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                {error && <span className='text-sm text-red-500'>{error}</span>}
            </div>
            <div className='w-full mb-4'><Button className='w-full' type='submit' disabled={isSubmitting} isLoading={isSubmitting}>注册</Button></div>
            <div className='text-sm'>
                <span className='mr-1'>已经有账户了?</span>
                <Link href='/login' className='underline underline-offset-4 cursor-pointer'>登录</Link>
            </div>
        </form>
    );
}