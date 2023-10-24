'use client';
import Image from 'next/image';
import Link from 'next/link';

import Box from '../ui/box';
import { Heart, Locked, Pined, Link as LinkIcon, Flag, Markup, Edit, DeleteBin, Reply } from '../icons';
import SplitBall from '../ui/split-ball';
import Button from '../ui/button';
import DateUtils from '@/lib/date-utils';
import ProseContent from '../ui/prose-content';

function ActionButton({ children }) {
    return (<Button kind='ghost' shape='square' size='sm'><span className='w-full h-full'>{children}</span></Button>);
}

function NoContent() {
    return (
        <Box className='h-16 flex justify-center items-center'>
            <span className='text-base font-bold text-neutral-400'>还没有内容，就等你来回帖啦</span>
        </Box>
    );
}

/*
    line 1: [User Avatar] username | created At | last edit at,
    line 2: post content
    line 3: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function PostList({ posts }) {
    if (!posts || posts.length === 0) return <NoContent />;
    return (
        <Box className='flex flex-col gap-4 pb-0.5'>
            {posts?.map((post, i) => (
                <div key={i} className='flex'>
                    <div className='flex flex-col items-center mr-2'>
                        <div className='w-9 h-9 bg-gray-300 rounded'><img className='w-full h-full rounded' src={post.user.avatar} alt={post.user.name} /></div>
                        {/* click line to collapse post replies */}
                        <div className='mt-2 my-1 border-l-2 border-neutral-600 h-full cursor-pointer hover:border-neutral-300' />
                    </div>
                    <div className='flex flex-col flex-1'>
                        <div className='flex items-center text-gray-300'>
                            <Link href={`/u/${post.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{post.user.name}</Link>
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs'>{DateUtils.fromNow(post.createdAt)}</span>
                        </div>
                        <ProseContent className='mt-2' content={post.content} />
                        <div className='text-xs inline-flex items-center justify-between text-gray-300'>
                            <div className='flex items-center'><span><Image width={16} height={16} src={'/reactions/heart.png'} alt='heart' /></span></div>
                            <div className='flex items-center gap-1'>
                                {/* reply  */}
                                <ActionButton><Reply /></ActionButton>
                                {/* give reaction  */}
                                <ActionButton><Heart /></ActionButton>
                                {/* copy url to share  */}
                                <ActionButton><LinkIcon /></ActionButton>
                                {/* report: owner, moderator and the user who has reported don't show this flag icon */}
                                <ActionButton><Flag /></ActionButton>
                                {/* define this port: owner, moderator. multi choose, items: spoiler(剧透)，NSFW(少儿不宜)，fake（假的），approved（实锤），spam（水贴）, OC（原创）, official（官方）*/}
                                <ActionButton><Markup /></ActionButton>
                                {/* edit:owner, moderator */}
                                <ActionButton><Edit /></ActionButton>
                                {/* delete:owner, moderator */}
                                <ActionButton><DeleteBin /></ActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Box>
    );
}
