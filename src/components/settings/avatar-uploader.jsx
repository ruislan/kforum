'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import CryptoJS from 'crypto-js';

import Spinner from '../ui/spinner';
import Button from '../ui/button';
import FormControl from '../ui/form-control';
import UserAvatar from '../ui/user-avatar';

const IMAGE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 2; // 2MB

export default function AvatarUploader({ user }) {
    const { status, update } = useSession();
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);
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
            return false;
        }
        return true;
    };


    const handleSubmit = async (file) => {
        if (isSubmitting) return;
        if (!validateFields(file)) return;
        setIsSubmitting(true);
        try {
            const checksum = await new Promise((resolve,) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target.result;
                    const wordArray = CryptoJS.lib.WordArray.create(result);
                    const hash = CryptoJS.SHA1(wordArray).toString();
                    resolve(hash);
                }
                reader.readAsArrayBuffer(file);
            });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('checksum', checksum);

            const res = await fetch('/api/settings/avatar', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const json = await res.json();
                setAvatarUrl(json.data);
                toast.success('保存成功');
                update({ avatarUrl: json.data }); // update user session
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
            avatarInput.current.value = null;
            setIsSubmitting(false);
        }
    }

    if (status === 'loading') return <Spinner />;
    if (!user) return null;
    return (
        <FormControl title='头像' subtitle='只支持PNG、JPG、JPEG格式的图片'>
            <UserAvatar
                className='shadow-lg mb-3'
                size='2xl'
                avatar={avatarUrl}
                name={user.name}
            />
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
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={() => avatarInput.current.click()}
                >
                    换新头像
                </Button>
                {error && <span className='text-sm text-red-500'>{error}</span>}
            </div>
        </FormControl>
    );
}