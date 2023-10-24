'use client';

import Image from 'next/image';
import Link from 'next/link';

import DateUtils from '@/lib/date-utils';
import Box from '../ui/box';
import { Blank, Heart, Locked, Pined, Link as LinkIcon, Bookmark, Flag, EyeOff, Markup, UnBookmark, Pin, Lock, Edit, DeleteBin, Reply } from '../icons';
import SplitBall from '../ui/split-ball';
import Tag from '../ui/tag';
import Button from '../ui/button';
import ProseContent from '../ui/prose-content';

function ActionButton({ children }) {
    return (<Button kind='ghost' shape='square' size='sm'><span className='w-full h-full'>{children}</span></Button>);
}

/*
    line 1: [User Avatar] username | created At ｜ space ___________ space | user actions?: follow? report,
    line 2: title / tags
    line 3: post content
    line 4: discussion meta: replies, reactions, participants
    line 5: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function DiscussionDetailInfo({ discussion }) {
    if (!discussion) return null;
    return (
        <Box className='flex flex-col pb-0.5'>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center mb-2 text-gray-300'>
                    {/* hide category if user is in the category */}
                    <div className='flex items-center'>
                        <span className='w-5 h-5 bg-gray-300 rounded mr-1.5'><Blank /></span>
                        <Link href={`/c/general`} onClick={e => e.stopPropagation()} className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/综合分类</Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'>
                        <div className='w-5 h-5 mr-1.5 bg-gray-300 rounded'><img className='w-full h-full rounded' src={discussion.user.avatar} alt={discussion.user.name} /></div>
                        <Link href={`/u/${discussion.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{discussion.user.name}</Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='text-xs'>{DateUtils.fromNow(discussion.createdAt)}</span>
                    {discussion.lastUpdatedAt && (
                        <>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs'>{`编辑于 ${DateUtils.fromNow(discussion.lastUpdatedAt)}`}</span>
                        </>
                    )}
                    {(discussion.isClosed || discussion.isSticky) && (<SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />)}
                    {discussion.isClosed && (<span className='h-4 w-4 mr-0.5'><Locked /></span>)}
                    {discussion.isSticky && (<span className='h-4 w-4 mr-1.5'><Pined /></span>)}
                </div>
                <h3 className='inline text-xl font-bold break-words text-neutral-200'>{discussion.title}</h3>
                <div className='flex flex-wrap gap-1 my-2'>
                    <Tag>News</Tag>
                    <Tag>Help</Tag>
                    <Tag>Function</Tag>
                    <Tag>Cheer</Tag>
                    <Tag>Great</Tag>
                </div>
                <ProseContent className='my-2' content={discussion.firstPost?.content} />
                <div className='text-xs inline-flex items-center justify-between text-gray-300'>
                    <div className='flex items-center'><span><Image width={16} height={16} src={'/reactions/heart.png'} alt='heart' /></span></div>
                    <div className='flex items-center gap-1'>
                        <ActionButton><Reply /></ActionButton>
                        {/* give reaction  */}
                        <ActionButton><Heart /></ActionButton>
                        {/* copy url to share  */}
                        <ActionButton><LinkIcon /></ActionButton>
                        {/* save to bookmark */}
                        <ActionButton><Bookmark /></ActionButton>
                        <ActionButton><UnBookmark /></ActionButton>
                        {/* report: owner, moderator and the user who has reported don't show this flag icon */}
                        <ActionButton><Flag /></ActionButton>
                        {/* hide */}
                        <ActionButton><EyeOff /></ActionButton>
                        {/* define this port: owner, moderator. multi choose, items: spoiler(剧透)，NSFW(少儿不宜)，fake（假的），approved（实锤），spam（水贴）, OC（原创）, official（官方）*/}
                        <ActionButton><Markup /></ActionButton>
                        {/* let discussion stay top of the discussion list: owner, moderator */}
                        <ActionButton><Pin /></ActionButton>
                        {/* lock all: owner, moderator */}
                        <ActionButton><Lock /></ActionButton>
                        {/* edit:owner, moderator */}
                        <ActionButton><Edit /></ActionButton>
                        {/* delete:owner, moderator */}
                        <ActionButton><DeleteBin /></ActionButton>
                    </div>
                </div>
            </div>
        </Box>
    );
}
