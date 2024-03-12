'use client';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

import dateUtils from '@/lib/date-utils';
import Box from '@/components/ui/box';
import { HeadingSmall } from '@/components/ui/heading';
import Spinner from '@/components/ui/spinner';
import Button from '@/components/ui/button';
import NoContent from '@/components/ui/no-content';
import SplitBall from '@/components/ui/split-ball';
import { LockedIcon, PinedIcon } from '@/components/icons';
import ProseContent from '@/components/ui/prose-content';
import UserAvatar from '@/components/ui/user-avatar';
import { REPORT_FILTERS, REPORT_TYPES } from '@/lib/constants';
import { runIfFn } from '@/lib/fn';
import UserFancyLink from '../user/user-fancy-link';

function ActionPerform({ reportIds, action, label, onPerformed }) {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/reports/perform', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    reportIds
                })
            });
            if (res.ok) {
                toast.success('已经成功处理');
                runIfFn(onPerformed);
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
            setIsLoading(false);
        }
    };
    return (
        <Button
            size='xs'
            isLoading={isLoading}
            onClick={e => {
                e.preventDefault();
                handleClick();
            }}>
            {label}
        </Button>
    );
}

export default function ReportList({ filter }) {
    const [isLoading, setIsLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const handlePerformed = async (item) => {
        setDataList(prev => prev.filter(p => p.id !== item.id));
    };

    const fetchDataList = useCallback(async () => {
        setIsLoading(true);
        try {
            let url = `/api/admin/reports?filter=${filter}&page=${page}`;
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                setDataList(prev => page > 1 ? [...prev, ...json.data] : json.data);
                setHasMore(json.hasMore);
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
            setIsLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        fetchDataList();
    }, [fetchDataList]);

    return (
        <Box className='flex flex-col'>
            <HeadingSmall>举报列表</HeadingSmall>
            <div className='flex flex-wrap text-sm font-semibold gap-2 mb-4'>
                {REPORT_FILTERS.map(f => (
                    <Link
                        className={clsx(
                            'text-sm text-gray-200 px-2 py-1 rounded-md hover:bg-neutral-700',
                            f.value === filter && 'bg-neutral-700 font-semibold'
                        )}
                        key={f.value}
                        href={`?filter=${f.value}`}
                    >
                        {f.name}
                    </Link>
                ))}
            </div>
            <div className='flex flex-col px-0.5 gap-3'>
                {dataList.map((item, index) => (
                    <div
                        key={index}
                        className={clsx(
                            'flex flex-col border-b pb-3 border-b-neutral-700',
                            'last:pb-1 last:border-none gap-2'
                        )}
                    >
                        <div className='flex items-center'>
                            <div className='flex items-center'>
                                {item.discussion.category.icon ?
                                    <span className='mr-1.5'><Image width={20} height={20} alt={item.discussion.category.name} src={item.discussion.category.icon} className='rounded' /></span> :
                                    <span className='w-5 h-5 rounded mr-1.5' style={{ backgroundColor: `${item.discussion.category.color || 'bg-gray-300'}`, }}></span>
                                }
                                <Link href={`/c/${item.discussion.category.slug}`} onClick={e => e.stopPropagation()}
                                    className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>
                                    c/{item.discussion.category.name}
                                </Link>
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <div className='flex items-center'>
                                <UserAvatar
                                    size='xs'
                                    className='mr-1.5'
                                    name={item.discussion.user.name}
                                    avatar={item.discussion.user.avatarUrl}
                                />
                                <UserFancyLink user={item.discussion.user} />
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs text-gray-400' suppressHydrationWarning>{dateUtils.fromNow(item.discussion.createdAt)}</span>
                            <span className='ml-1' />
                            {item.discussion.isSticky && (<span className='h-4 w-4 ml-1.5 text-green-400'><PinedIcon /></span>)}
                            {item.discussion.isLocked && (<span className='h-3.5 w-3.5 ml-0.5 text-yellow-400'><LockedIcon /></span>)}
                        </div>
                        <div className='relative mb-1'>
                            <Link href={`/d/${item.discussion.id}`} className='inline text-gray-50 text-lg font-bold break-words'>
                                {item.discussion.deletedAt ? '该话题已被删除' : item.discussion.title}
                            </Link>
                        </div>
                        <div className='flex p-2.5 bg-zinc-700 rounded-md'>
                            <div className='flex flex-col items-center mr-2'>
                                <UserAvatar size='sm' name={item.user.name} avatar={item.user.avatarUrl} />
                            </div>
                            <div className='flex flex-col flex-1'>
                                <div className='flex items-center text-gray-300'>
                                    <UserFancyLink user={item.user} />
                                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(item.createdAt)}</span>
                                </div>
                                <ProseContent className='my-1' content={item.deletedAt ? '该帖子已被删除' : item.content} />
                            </div>
                        </div>
                        <h3 className='text-sm text-gray-300 font-semibold'>举报内容</h3>
                        <div className='flex flex-col text-sm text-gray-200 gap-1.5'>
                            {item.reports.map((report, j) => (
                                <div key={j} className='flex flex-col p-2 rounded-md bg-zinc-700 gap-1'>
                                    <div className='flex items-center text-gray-300 text-xs'>
                                        <Link
                                            href={`/u/${report.user.name}`}
                                            onClick={e => e.stopPropagation()}
                                            className='hover:underline underline-offset-2 cursor-pointer'>
                                            u/{report.user.name}
                                        </Link>
                                        <span>&nbsp;于&nbsp;</span>
                                        <span suppressHydrationWarning>{dateUtils.fromNow(report.createdAt)}&nbsp;举报此贴，认为此贴&nbsp;</span>
                                        <span className='font-semibold '>{REPORT_TYPES.find(r => r.value === report.type).name}</span>
                                        <span>。</span>
                                        {report.ignoredUser && (
                                            <>
                                                <span>&nbsp;管理员&nbsp;</span>
                                                <Link
                                                    href={`/u/${report.ignoredUser.name}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className='hover:underline underline-offset-2 cursor-pointer'>
                                                    u/{report.ignoredUser.name}
                                                </Link>
                                                <span>&nbsp;于&nbsp;</span>
                                                <span suppressHydrationWarning>{dateUtils.fromNow(report.ignoredAt)}</span>
                                                <span className='font-semibold'>&nbsp;忽略了此举报&nbsp;</span>
                                            </>
                                        )}
                                        {report.agreedUser && (
                                            <>
                                                <span>&nbsp;管理员&nbsp;</span>
                                                <Link
                                                    href={`/u/${report.agreedUser.name}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className='hover:underline underline-offset-2 cursor-pointer'>
                                                    u/{report.agreedUser.name}
                                                </Link>
                                                <span>&nbsp;于&nbsp;</span>
                                                <span suppressHydrationWarning>{dateUtils.fromNow(report.agreedAt)}</span>
                                                <span className='font-semibold'>&nbsp;认可了此举报&nbsp;</span>
                                            </>
                                        )}
                                    </div>
                                    {report.reason && (
                                        <div className='text-xs'>
                                            “{report.reason}“
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {item.reports.every(r => !r.ignored && !r.agreed) && (
                            <>
                                <h3 className='text-sm text-gray-300 font-semibold'>是否认可上述{item.reports.length > 1 && '这些'}举报内容?</h3>
                                <div className='flex items-center text-gray-300 gap-2'>
                                    <ActionPerform action='agree' label='是' reportIds={item.reports.map(r => r.id)} onPerformed={() => handlePerformed(item)} />
                                    <ActionPerform action='ignore' label='否' reportIds={item.reports.map(r => r.id)} onPerformed={() => handlePerformed(item)} />
                                </div>
                                <span className='text-xs text-gray-400'>认可将会删除该贴及其所有关联的内容，帖子的回复、图片、举报等；不认可将会忽略掉这些举报</span>
                            </>
                        )}
                    </div>
                ))}
                {!isLoading && dataList.length === 0 && <NoContent noWrap text='没有数据' />}
            </div>
            {isLoading && <Spinner className='self-center' />}
            {hasMore && !isLoading && (
                <div className='self-center py-2'>
                    <Button kind='ghost' disabled={isLoading} onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </Box>
    );
}
