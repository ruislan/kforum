'use client';

import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import toast from "react-hot-toast";
import FormControl from "../ui/form-control";

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
                    <Input
                        value={setting.value}
                        name={setting.key}
                        onChange={e => {
                            setting.value = e.target.value;
                            setSettings([...settings]);
                        }}
                    />
                </FormControl>
            )}
            {error && <span className='text-sm text-red-500'>{error}</span>}
            <div>
                <Button isLoading={isSubmitting} disabled={isSubmitting}>保存</Button>
            </div>
        </form>
    );
}