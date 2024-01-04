'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import dateUtils from '@/lib/date-utils';

import Box from '../ui/box';
import SplitBall from '../ui/split-ball';
import Tag from '../ui/tag';
import ProseContent from '../ui/prose-content';
import UserAvatar from '../ui/user-avatar';
import UserMark from '../ui/user-mark';
import DiscussionMark from '../ui/discussion-mark';
import clsx from 'clsx';

export default function DiscussionListItem({
    discussion,
    isCardStyle = false
}) {
    const router = useRouter();
    const c = discussion.category;
    if (!discussion) return null;
    return (
        <Box
            className='flex flex-col hover:border-neutral-500 cursor-pointer'
            onClick={() => location.href = '/d/' + discussion.id}
        >
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
                        <UserMark isAdmin={discussion.user?.isAdmin} isModerator={discussion.user?.isModerator} isLocked={discussion.user?.isLocked} />
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(discussion.createdAt)}</span>
                    <DiscussionMark isSticky={discussion.isSticky} isLocked={discussion.isLocked} />
                </div>
                <div className={clsx(
                    'mb-2 gap-1',
                    isCardStyle ?
                        'flex justify-between' :
                        'flex flex-col'
                )}>
                    <div className='inline-block relative'>
                        <div className='inline text-gray-50 text-lg font-bold break-words'>{discussion.title}</div>
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
                    </div>
                    {discussion.poster ?
                        <div className='relative flex justify-center'>
                            <Image
                                className={clsx(
                                    isCardStyle ?
                                        'max-h-24 w-36' :
                                        'max-h-[496px] w-auto'
                                )}
                                width={640} height={380}
                                src={discussion.poster.url}
                                alt={discussion.poster.originalFileName}
                            />
                        </div> :
                        <ProseContent className='max-h-64 overflow-hidden content-mask-b' content={discussion.firstPost?.text} />
                    }
                </div>
                <div className='text-xs inline-flex items-center text-gray-300 mt-1'>
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
