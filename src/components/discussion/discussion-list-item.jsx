'use client';
import Link from 'next/link';

import { Blank, Lock, Locked, Pin, Pined, Post as PostIcon } from '../icons';
import Box from '../ui/box';
import { toHTML } from '../ui/tiptap';
import SplitBall from '../ui/split-ball';
import Tag from '../ui/tag';
import DateUtils from '@/lib/date-utils';
import ProseContent from '../ui/prose-content';

/*
    line 1: [User Avatar] username | created At ｜ space ___________ space | user actions?: follow? report,
    line 2: title / tags
    line 3: post content
    line 4: discussion meta: replies, reactions, participants
    line 5: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function DiscussionListItem({ discussion }) {
    if (!discussion) return null;
    return (
        <Box className='flex flex-col hover:border-neutral-500 cursor-pointer' onClick={() => location.href = '/d/' + discussion.id}>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center mb-3 text-gray-300'>
                    {/* hide category if user is in the category */}
                    {discussion.category && (
                        <>
                            <div className='flex items-center'>
                                <span className='w-6 h-6 bg-gray-300 rounded mr-1.5'><Blank /></span>
                                <Link href={`/c/${discussion.category.slug}`} onClick={e => e.stopPropagation()}
                                    className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/{discussion.category.name}</Link>
                            </div>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        </>
                    )}
                    <div className='flex items-center'>
                        <div className='w-6 h-6 mr-1.5 bg-gray-300 rounded'>
                            <img className='w-full h-full rounded' src={discussion.user?.avatar} alt={discussion.user?.name} />
                        </div>
                        <Link href={`/u/${discussion.user?.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{discussion.user?.name}</Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='text-xs'>{DateUtils.fromNow(discussion.createdAt)}</span>
                    {(discussion.isClosed || discussion.isSticky) && (<SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />)}
                    {discussion.isClosed && (<span className='h-4 w-4 mr-0.5'><Locked /></span>)}
                    {discussion.isSticky && (<span className='h-4 w-4 mr-1.5'><Pined /></span>)}
                </div>
                <div className='inline-block relative'>
                    <h3 className='inline text-lg font-bold break-words'>{discussion.title}</h3>
                    <Tag className='ml-1'>News</Tag>
                    <Tag className='ml-1'>Help</Tag>
                    <Tag className='ml-1'>Function</Tag>
                    <Tag className='ml-1'>Cheer</Tag>
                    <Tag className='ml-1'>Great</Tag>
                </div>
                <ProseContent className='mt-2 max-h-64 overflow-hidden content-mask-b' content={discussion.firstPost?.content} />
                <div className='text-xs inline-flex items-center text-gray-300 mt-3'>
                    <div className='flex items-center'><span>参与 {discussion.userCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>回复 {discussion._count.posts}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>反馈 {discussion.reactionCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>浏览 {discussion.viewCount}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>分享 {discussion.shareCount}</span></div>
                </div>
            </div>
        </Box>
    );
}