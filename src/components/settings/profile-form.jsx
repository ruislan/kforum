'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import Input from '../ui/input';
import Image from 'next/image';

export default function ProfileForm() {
    const { data, status } = useSession();
    const [email, setEmail] = useState(data.user?.email);
    const [gender, setGender] = useState(data.user?.gender);
    const [bio, setBio] = useState(data.user?.bio);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
    }

    if (status === 'loading') return <Spinner />;

    return (
        <form
            className='flex flex-col gap-4 text-neutral-200'
            onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>头像</h3>
                <div className='w-32 h-32 bg-gray-300 rounded z-10 shadow-lg'>
                    <Image width={128} height={128} src={data.user?.avatar} alt={data.user?.name} />
                </div>
                <div>
                    <Button type='button' size='xs'>换新头像</Button>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>性别</h3>
                <select
                    className='w-full text-sm h-10 p-2 rounded bg-transparent border border-neutral-700 outline-none'
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                >
                    <option value='MAN'>男</option>
                    <option value='WOMAN'>女</option>
                    <option value='UNKNOWN'>保密</option>
                </select>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-bold'>自我介绍</h3>
                <textarea className='w-full text-sm h-32 p-2 min-h-[40px] rounded bg-transparent border border-neutral-700 outline-none'>
                    {bio}
                </textarea>
            </div>
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}