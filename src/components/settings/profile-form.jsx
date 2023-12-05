'use client';
import { useState } from 'react';

import Button from '../ui/button';
import Select from '../ui/select';
import toast from 'react-hot-toast';
import FormControl from '../ui/form-control';

const genderOptions = [
    { label: '男', value: 'MAN' },
    { label: '女', value: 'WOMAN' },
    { label: '保密', value: 'UNKNOWN' },
];

export default function ProfileForm({ user }) {
    const [gender, setGender] = useState(user?.gender);
    const [bio, setBio] = useState(user?.bio);
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
            const res = await fetch('/api/settings/profile', {
                method: 'PUT',
                body: JSON.stringify({ gender, bio }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                toast.success('保存成功');
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    setError(json.message);
                } else if (res.status === 401) {
                    setError('您的登录已过期，请重新登录');
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

    if (!user) return null;

    return (
        <form
            className='flex flex-col gap-4 text-gray-100'
            onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <FormControl title='性别'>
                <Select
                    label='选择性别'
                    value={genderOptions.find(option => option.value === gender)}
                    onChange={option => setGender(option.value)}
                    options={genderOptions}
                >
                </Select>
            </FormControl>
            <FormControl title='自我介绍'>
                <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={300}
                    placeholder='请输入自我介绍'
                    name='bio'
                    className='w-full text-sm h-32 py-2 px-3 min-h-[40px] rounded-md bg-transparent border border-neutral-700 outline-none focus-within:border-neutral-400'
                />
            </FormControl>
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}