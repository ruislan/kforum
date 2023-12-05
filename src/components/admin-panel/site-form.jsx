'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

import Input from '../ui/input';
import Button from '../ui/button';
import FormControl from '../ui/form-control';
import { Image as ImageIcon, DeleteBin } from '../icons';
import { runIfFn } from '@/lib/fn';
import { SITE_SETTING_TYPES } from '@/lib/constants';

const IMAGE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 10; // 10MB

function ImageType({ value, onDeleted, onUploaded }) {
    const imageInput = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState(value);

    const validateFields = (file) => {
        if (!file || file.size === 0) {
            toast.error('请先选择图片');
            return false;
        }
        if (file.size > IMAGE_UPLOAD_SIZE_LIMIT) {
            toast.error('图片大小不能超过10MB');
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

            const res = await fetch('/api/uploads', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const json = await res.json();
                setImageUrl(json.data.url);
                runIfFn(onUploaded, { ...json.data });
            } else {
                if (res.status === 400) {
                    const json = await res.json();
                    toast.error(json.message);
                } else if (res.status === 401) {
                    toast.error('您的登录已过期，请重新登录');
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            toast.error('未知错误，请稍后再试');
        } finally {
            imageInput.current.value = null;
            setIsSubmitting(false);
        }
    }
    return (
        <div
            className={clsx(
                'bg-gray-300 w-[360px] h-[120px]',
                'bg-contain bg-no-repeat bg-center'
            )}
            style={{
                backgroundImage: `url(${imageUrl})`
            }}
        >
            <div className='relative flex items-center gap-1 w-full p-2 bg-transparent'>
                <input
                    ref={imageInput}
                    hidden
                    type='file'
                    accept='image/*'
                    onChange={e => {
                        e.preventDefault();
                        handleSubmit(e.target.files[0]);
                    }}
                />
                <div
                    className={clsx(
                        'w-6 h-6 rounded flex items-center justify-center cursor-pointer',
                        'bg-black hover:bg-opacity-80 bg-opacity-50 shadow'
                    )}
                    onClick={e => {
                        e.preventDefault();
                        imageInput.current.click();
                    }}
                >
                    <span className='w-4 h-4'><ImageIcon /></span>
                </div>
                <div
                    className={clsx(
                        'w-6 h-6 rounded flex items-center justify-center cursor-pointer',
                        'bg-black hover:bg-opacity-80 bg-opacity-50 shadow'
                    )}
                    onClick={e => {
                        e.preventDefault();
                        setImageUrl('');
                        runIfFn(onDeleted);
                    }}
                >
                    <span className='w-4 h-4'><DeleteBin /></span>
                </div>
            </div>
        </div>
    );
}

export default function SiteForm({ settings: initSettings }) {
    const [settings, setSettings] = useState(initSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setError(null);
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/settings/site', {
                method: 'PUT',
                body: JSON.stringify({
                    settings: settings.map(s => ({
                        id: s.id,
                        key: s.key,
                        value: s.value,
                        dataType: s.dataType,
                    }))
                }),
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

    if (!settings) return null;
    return (
        <form
            className='flex flex-col gap-4 text-gray-100'
            onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            {settings.map(setting =>
                <FormControl key={setting.key} title={setting.name} subtitle={setting.description}>
                    {setting.dataType === SITE_SETTING_TYPES.string && (
                        <Input
                            value={setting.value}
                            name={setting.key}
                            onChange={e => {
                                setting.value = e.target.value;
                                setSettings([...settings]);
                            }}
                        />
                    )}
                    {setting.dataType === SITE_SETTING_TYPES.image &&
                        <ImageType
                            value={setting.value}
                            onUploaded={(image) => {
                                setting.value = image.url;
                                setSettings([...settings]);
                            }}
                            onDeleted={() => {
                                setting.value = '';
                                setSettings([...settings]);
                            }}
                        />}
                </FormControl>
            )}
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}