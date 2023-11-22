'use client';
import Link from 'next/link';
import Image from 'next/image';

import dateUtils from '@/lib/date-utils';

import { Blank, Lock, Locked, Pin, Pined, Post as PostIcon } from '../icons';
import Box from '../ui/box';
import SplitBall from '../ui/split-ball';
import Tag from '../ui/tag';
import ProseContent from '../ui/prose-content';
import UserAvatar from '../ui/user-avatar';

export default function DiscussionListItem({ discussion }) {
    const c = discussion.category;
    if (!discussion) return null;
    return (
        <Box
            className='flex flex-col hover:border-neutral-500 cursor-pointer'
            onClick={() => location.href = '/d/' + discussion.id}>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center mb-2 text-gray-300'>
                    {c && (
                        <>
                            <div className='flex items-center'>
                                {c.icon ?
                                    <span className='mr-1.5'><Image width={20} height={20} alt={c.name} src={c.icon} className='rounded' /></span> :
                                    <span className='w-5 h-5 rounded mr-1.5' style={{ backgroundColor: `${c.color || 'bg-gray-300'}`, }}></span>
                                }
                                <Link href={`/c/${c.slug}`} onClick={e => e.stopPropagation()}
                                    className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/{c.name}</Link>
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        </>
                    )}
                    <div className='flex items-center'>
                        <UserAvatar
                            size='xs'
                            className='mr-1.5'
                            name={discussion.user?.name}
                            avatar={discussion.user?.avatarUrl}
                        />
                        <Link
                            href={`/u/${discussion.user?.name}`}
                            onClick={e => e.stopPropagation()}
                            className='text-xs hover:underline underline-offset-2 cursor-pointer'>
                            u/{discussion.user?.name}
                        </Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(discussion.createdAt)}</span>
                    <span className='ml-1' />
                    {discussion.isSticky && (<span className='h-4 w-4 ml-0.5 text-green-400'><Pined /></span>)}
                    {discussion.isLocked && (<span className='h-3.5 w-3.5 ml-0.5 text-yellow-400'><Locked /></span>)}
                </div>
                <div className='inline-block relative mb-1'>
                    <div className='inline text-gray-50 text-lg font-bold break-words'>{discussion.title}</div>
                    {/* <div className='inline-flex flex-wrap ml-2 gap-1'>
                        <Tag>News</Tag>
                        <Tag>Great</Tag>
                    </div> */}
                </div>
                {discussion.poster ?
                    <div className='relative flex w-full justify-center pb-2'>
                        <Image
                            className='max-h-[496px] w-auto'
                            width={640} height={380}
                            src={discussion.poster.url}
                            alt={discussion.poster.originalFileName}
                        />
                    </div> :
                    <ProseContent className='pb-2 max-h-64 overflow-hidden content-mask-b' content={discussion.firstPost?.text} />
                }
                <div className='text-xs inline-flex items-center text-gray-300 mt-2'>
                    <div className='flex items-center'><span>参与 {discussion.userCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>帖子 {discussion.postCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>反馈 {discussion.reactionCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>浏览 {discussion.viewCount}</span></div>
                    {/* <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>分享 {discussion.shareCount}</span></div> */}
                </div>
            </div>
        </Box>
    );
}
