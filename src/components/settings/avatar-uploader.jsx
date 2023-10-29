'use client';
import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import Image from 'next/image';
import toast from 'react-hot-toast';

const IMAGE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 2; // 2MB

export default function AvatarUploader({ user }) {
    const { status, update } = useSession();
    const [avatar, setAvatar] = useState(user?.avatar);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const avatarInput = useRef();

    const validateFields = (file) => {
        setError(null);
        if (!file || file.size === 0) {
            setError('你还没准备好，请先选择头像');
            return false;
        }
        if (file.size > IMAGE_UPLOAD_SIZE_LIMIT) {
            setError('图片大小不能超过2MB');
            return;
        }
        return true;
    };


    const handleSubmit = async (file) => {
        if (isSubmitting) return;
        if (!validateFields(file)) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/settings/avatar', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const json = await res.json();
                setAvatar(json.data);
                toast.success('保存成功');
                update({ avatar: json.data }); // update user session
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
    }

    if (status === 'loading') return <Spinner />;
    if (!user) return null;
    return (
        <div className='flex flex-col'>
            <h3 className='font-bold mb-1'>头像</h3>
            <div className='w-32 h-32 bg-gray-300 rounded shadow-lg mb-3'>
                <Image width={128} height={128} src={avatar} alt={user?.name} />
            </div>
            <div className='flex items-center gap-2'>
                <input
                    ref={avatarInput}
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={e => {
                        e.preventDefault();
                        handleSubmit(e.target.files[0]);
                    }}
                />
                <Button
                    type='button'
                    size='xs'
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={() => avatarInput.current.click()}
                >
                    换新头像
                </Button>
                {error && <span className='text-sm text-red-500'>{error}</span>}
            </div>
        </div>
    );
}