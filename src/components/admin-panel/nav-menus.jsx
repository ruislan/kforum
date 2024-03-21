'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import Box from '../ui/box';
import Button from '../ui/button';
import { HeadingSmall } from '../ui/heading';
import Spinner from '../ui/spinner';
import { DeleteBinIcon } from '../icons';
import Input from '../ui/input';

export default function NavMenus() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [dataList, setDataList] = useState([]);

    const handleAddClick = async () => {
        setDataList([...dataList, { name: '', url: '' }]);
    }

    const handleDeleteClick = async (item) => {
        setDataList(dataList.filter(i => i !== item));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const menus = dataList.filter(item => item.name?.length > 0 && item.url?.length > 0);
            const res = await fetch(`/api/admin/menus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ menus })
            });
            if (res.ok) {
                toast.success('设置成功');
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
            toast.error('未知错误，请重新尝试，或者刷新页面');
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/menus`);
                if (res.ok) {
                    const json = await res.json();
                    setDataList(json.data);
                } else {
                    toast.error('未知错误，请刷新重试');
                }
            } catch (err) {
                toast.error('未知错误，请刷新重试');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <Box className='flex flex-col'>
            <HeadingSmall>导航设置</HeadingSmall>

            {isLoading && <Spinner className='self-center' />}
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-4 items-center gap-2 w-full mb-2 text-sm'>
                    <div>名称</div>
                    <div>URL</div>
                    <div>顺序</div>
                    <div></div>
                </div>
                {dataList.map((item, index) => (
                    <div key={index} className='grid grid-cols-4 items-center gap-2 w-full mb-2'>
                        <Input type='text' value={item.name} onChange={e => {
                            item.name = e.target.value;
                            setDataList([...dataList]);
                        }} />
                        <Input type='text' value={item.url} onChange={e => {
                            item.url = e.target.value;
                            setDataList([...dataList]);
                        }} />
                        <Input type='text' value={item.sequence} onChange={e => {
                            item.sequence = e.target.value;
                            setDataList([...dataList]);
                        }} />
                        <Button
                            type='button'
                            size='sm'
                            kind='ghost'
                            shape='square'
                            onClick={() => handleDeleteClick(item)}
                        >
                            <span className='w-4 h-4 text-gray-400'>
                                <DeleteBinIcon />
                            </span>
                        </Button>
                    </div>
                ))}
                <div className='flex items-center justify-between mb-2'>
                    <div
                        className='text-sm underline underline-offset-2 cursor-pointer text-gray-200'
                        onClick={() => handleAddClick()}
                    >
                        增加新导航
                    </div>
                </div>
                <div className='text-xs text-gray-400 mb-4'>注意：导航设置会影响到所有页面的导航栏，请谨慎设置</div>
                <div className='flex items-center justify-between'>
                    <Button type='submit' isLoading={isSubmitting}>保存</Button>
                </div>
            </form>
        </Box>
    );
}
