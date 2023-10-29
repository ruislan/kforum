'use client';
import { useState } from 'react';

import Button from '../ui/button';
import Input from '../ui/input';
import toast from 'react-hot-toast';

export default function SecurityForm() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const resetFields = () => {
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
    };

    const validateFields = () => {
        setError(null);
        if (newPassword.length < 6) {
            setError('新设密码长度至少为 6 位');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('两次密码输入不一致');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateFields()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/settings/password', {
                method: 'PUT',
                body: JSON.stringify({ password, newPassword }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                resetFields();
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

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                handleSubmit();
            }}
            className='flex flex-col gap-4 text-neutral-200'
        >
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>当前密码</h3>
                <Input
                    type='password'
                    name='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>新设密码</h3>
                <Input
                    type='password'
                    name='newPassword'
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>新密码确认</h3>
                <Input
                    type='password'
                    name='confirmPassword'
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
            </div>
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}