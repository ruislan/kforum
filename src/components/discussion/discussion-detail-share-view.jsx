'use client';
import Link from 'next/link';
import Image from 'next/image';

import { PostReplyContent } from './post-list';
import Box from '../ui/box';
import SplitBall from '../ui/split-ball';
import UserAvatar from '../ui/user-avatar';
import UserMark from '../ui/user-mark';
import DiscussionMark from '../ui/discussion-mark';
import dateUtils from '@/lib/date-utils';
import Tag from '../ui/tag';
import ProseContent from '../ui/prose-content';
import ReactionGroup from '../ui/reaction-group';

export default function DiscussionDetailShareView({ discussion, post }) {
    const c = discussion.category;
    return (
        <>
            <Box className='flex flex-col pb-0.5'>
                <div className='flex flex-col flex-1'>
                    <div className='flex items-center mb-2 text-gray-300'>
                        <div className='flex items-center'>
                            {c.icon ?
                                <span className='mr-1.5'><Image width={20} height={20} alt={c.name} src={c.icon} className='rounded' /></span> :
                                <span className='w-5 h-5 rounded mr-1.5' style={{ backgroundColor: `${c.color || 'bg-gray-300'}`, }}></span>
                            }
                            <Link href={`/c/${c?.slug}`} onClick={e => e.stopPropagation()} className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/{c?.name}</Link>
                        </div>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <div className='flex items-center'>
                            <UserAvatar className='mr-1.5' size='xs' name={discussion.user.name} avatar={discussion.user.avatarUrl} />
                            <Link href={`/u/${discussion.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{discussion.user.name}</Link>
                            <UserMark isAdmin={discussion.user.isAdmin} isModerator={discussion.user.isModerator} isLocked={discussion.user.isLocked} />
                        </div>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(discussion.createdAt)}</span>
                        {discussion.lastUpdatedAt && (
                            <>
                                <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                                <span className='text-xs'>{`编辑于 ${dateUtils.fromNow(discussion.lastUpdatedAt)}`}</span>
                            </>
                        )}
                        <DiscussionMark isSticky={discussion.isSticky} isLocked={discussion.isLocked} />
                    </div>
                    <div className='inline-block relative mb-1'>
                        <h2 className='inline text-xl font-bold break-words text-gray-50'>{discussion.title}</h2>
                        {discussion?.tags && (
                            <div className='inline-flex flex-wrap ml-2 gap-1 align-text-top'>
                                {discussion.tags.map(tag => (
                                    <Tag
                                        key={tag.id}
                                        color={tag.textColor}
                                        bgColor={tag.bgColor}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            router.push(`/t/${tag.name}`);
                                        }}
                                    >
                                        {tag.name}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                    <ProseContent className='my-3' content={discussion.firstPost?.content} />
                    <div className='text-xs inline-flex items-center justify-between text-gray-300 mb-0.5'>
                        <ReactionGroup reactions={discussion.firstPost?.reactions} />
                    </div>
                </div>
            </Box>
            <Box>
                <Link
                    className='text-sm text-gray-300 hover:underline underline-offset-2 hover:text-gray-50'
                    href={`/d/${discussion.id}`}
                >
                    查看全部回帖
                </Link>
            </Box>
            <Box className='flex flex-col gap-3 pb-2'>
                <div className='flex'>
                    <div className='flex flex-col items-center mr-2'>
                        <UserAvatar name={post.user.name} avatar={post.user.avatarUrl} />
                    </div>
                    <div className='flex flex-col flex-1'>
                        <div className='flex items-center text-gray-300'>
                            <Link href={`/u/${post.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{post.user.name}</Link>
                            <UserMark isAdmin={post.user.isAdmin} isModerator={post.user.isModerator} isLocked={post.user.isLocked} />
                            <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                            <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(post.createdAt)}</span>
                        </div>
                        <PostReplyContent replyPost={post.replyPost} />
                        <ProseContent className='my-1' content={post.content} />
                        <div className='text-xs inline-flex items-center justify-between text-gray-300'>
                            <ReactionGroup reactions={post.reactions || []} />
                        </div>
                    </div>
                </div>
            </Box>
        </>
    );
}