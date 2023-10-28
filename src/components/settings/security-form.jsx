'use client';
import { useState } from 'react';

import Button from '../ui/button';
import Input from '../ui/input';

export default function SecurityForm() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
    };

    return (
        <form
            onSubmit={e => {
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