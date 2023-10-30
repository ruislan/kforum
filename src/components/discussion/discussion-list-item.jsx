'use client';
import Link from 'next/link';

import { Blank, Lock, Locked, Pin, Pined, Post as PostIcon } from '../icons';
import Box from '../ui/box';
import SplitBall from '../ui/split-ball';
import Tag from '../ui/tag';
import DateUtils from '@/lib/date-utils';
import ProseContent from '../ui/prose-content';
import Image from 'next/image';

/*
    line 1: [User Avatar] username | created At ｜ space ___________ space | user actions?: follow? report,
    line 2: title / tags
    line 3: post content
    line 4: discussion meta: replies, reactions, participants
    line 5: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function DiscussionListItem({ discussion }) {
    const c = discussion.category;
    if (!discussion) return null;
    return (
        <Box className='flex flex-col hover:border-neutral-500 cursor-pointer' onClick={() => location.href = '/d/' + discussion.id}>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center mb-3 text-gray-300'>
                    {c && (
                        <>
                            <div className='flex items-center'>
                                {c.icon ?
                                    <span className='mr-1.5'><Image alt={c.name} src={c.icon} className='w-4 h-4 rounded' /></span> :
                                    <span className='w-5 h-5 rounded mr-1.5' style={{ backgroundColor: `${c.color || 'bg-gray-300'}`, }}></span>
                                }
                                <Link href={`/c/${c.slug}`} onClick={e => e.stopPropagation()}
                                    className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/{c.name}</Link>
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        </>
                    )}
                    <div className='flex items-center'>
                        <div className='w-5 h-5 mr-1.5 bg-gray-300 rounded'>
                            <Image className='rounded' width={20} height={20}  src={discussion.user?.avatar} alt={discussion.user?.name} />
                        </div>
                        <Link href={`/u/${discussion.user?.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{discussion.user?.name}</Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='text-xs'>{DateUtils.fromNow(discussion.createdAt)}</span>
                    <span className='ml-1' />
                    {discussion.isSticky && (<span className='h-4 w-4 ml-0.5 text-green-400'><Pined /></span>)}
                    {discussion.isLocked && (<span className='h-3.5 w-3.5 ml-0.5 text-yellow-400'><Locked /></span>)}
                </div>
                {/* <div className='inline-block relative'>
                    <h3 className='inline text-lg font-bold break-words'>{discussion.title}</h3>
                    <Tag className='ml-1'>News</Tag>
                    <Tag className='ml-1'>Help</Tag>
                    <Tag className='ml-1'>Function</Tag>
                    <Tag className='ml-1'>Cheer</Tag>
                    <Tag className='ml-1'>Great</Tag>
                </div> */}
                <ProseContent className='max-h-64 overflow-hidden content-mask-b' content={discussion.firstPost?.content} />
                <div className='text-xs inline-flex items-center text-gray-300 mt-3'>
                    <div className='flex items-center'><span>参与 {discussion.userCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>回复 {discussion.postCount || 0}</span></div>
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
