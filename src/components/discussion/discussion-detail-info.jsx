'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import dateUtils from '@/lib/date-utils';
import { runIfFn } from '@/lib/fn';
import Box from '../ui/box';
import { LockIcon, EditIcon, MoreIcon } from '../icons';
import SplitBall from '../ui/split-ball';
import ActionButton from '../ui/action-button';
import ProseContent from '../ui/prose-content';
import ActionDelete from './action-delete';
import ActionSticky from './action-sticky';
import ActionLock from './action-lock';
import ActionReact from './action-react';
import ReactionGroup from '../ui/reaction-group';
import PostUpdater from './post-updater';
import ActionReply from './action-reply';
import Tag from '../ui/tag';
import UserAvatar from '../ui/user-avatar';
import ActionReport from './action-report';
import ActionTags from './action-tags';
import UserMark from '../ui/user-mark';
import DiscussionMark from '../ui/discussion-mark';
import ActionBookmark from './action-bookmark';
import ActionCopyLink from './action-copy-link';

/*
    line 1: [User Avatar] username | created At ｜ space ___________ space | user actions?: follow? report,
    line 2: title / tags
    line 3: post content
    line 4: discussion meta: replies, reactions, participants
    line 5: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function DiscussionDetailInfo({ discussion, onReplyClick, onLockClick }) {
    const router = useRouter();
    const { data, status } = useSession();
    const [firstPost, setFirstPost] = useState(discussion?.firstPost);
    const [reactions, setReactions] = useState(discussion?.firstPost?.reactions);
    const [tags, setTags] = useState(discussion?.tags);
    const [isSticky, setIsSticky] = useState(discussion?.isSticky);
    const [isLocked, setIsLocked] = useState(discussion?.isLocked);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isExpendAction, setIsExpendAction] = useState(false);

    const isAuthenticated = status === 'authenticated';
    const isOwner = isAuthenticated && data.user.id === discussion?.user.id;
    const isAdmin = isAuthenticated && data.user.isAdmin;
    const isModerator = isAuthenticated && data.user.isModerator;
    const c = discussion.category;

    const handleUserReacted = async ({ reaction, isReacted }) => {
        let arr = [...reactions];
        const existReaction = arr.find(r => r.id === reaction.id);
        if (isReacted) {
            if (existReaction) existReaction.count += 1;
            else arr.push({ ...reaction, count: 1 });
        } else {
            if (existReaction) existReaction.count -= 1;
            if (existReaction.count === 0) arr = arr.filter(r => r.id !== existReaction.id);
        }
        arr.sort((a, b) => b.count - a.count);
        setReactions(arr); // 将变更后的数据设置到state中触发更新
    };

    const handleLockClick = async (lock) => {
        setIsLocked(lock);
        discussion.isLocked = lock;
        runIfFn(onLockClick, lock);
    };

    if (!discussion) {
        router.replace('/');
        return;
    }

    return (
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
                    <DiscussionMark isSticky={isSticky} isLocked={isLocked} />
                </div>
                <div className='inline-block relative mb-1'>
                    <h2 className='inline text-xl font-bold break-words text-gray-50'>{discussion.title}</h2>
                    {tags && (
                        <div className='inline-flex flex-wrap ml-2 gap-1 align-text-top'>
                            {tags.map(tag => (
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
                {isEditMode ?
                    <PostUpdater
                        post={firstPost}
                        onUpdated={({ content, text }) => {
                            const updatedPost = { ...firstPost, content, text };
                            discussion.firstPost = updatedPost;
                            setFirstPost(updatedPost);
                            setIsEditMode(false);
                        }}
                        onCanceled={() => setIsEditMode(false)}
                    /> :
                    <ProseContent className='my-3' content={firstPost?.content} />
                }

                {!isEditMode && (
                    <div className='text-xs inline-flex flex-col items-end gap-1 mt-1 md:flex-row md:items-center md:justify-between text-gray-300'>
                        <ReactionGroup reactions={reactions} />
                        <div className='flex items-center gap-1'>
                            {!isLocked && <ActionReply onClick={() => runIfFn(onReplyClick)} />}
                            {/* give reaction  */}
                            <ActionReact post={firstPost} onReacted={handleUserReacted} />
                            {/* save to bookmark */}
                            <ActionBookmark post={firstPost} />
                            {/* copy url to share  */}
                            <ActionCopyLink />
                            {
                                isExpendAction ?
                                    (
                                        <>
                                            {isAuthenticated && <ActionReport post={firstPost} />}
                                            {(isOwner || isAdmin || isModerator) &&
                                                <>
                                                    {/* give discussion tags: admin, moderator, owner */}
                                                    <ActionTags discussion={discussion} onSelected={tags => { setTags(tags); discussion.tags = tags; }} />
                                                    {/* edit:owner, moderator, admin */}
                                                    <ActionButton onClick={() => setIsEditMode(true)}><EditIcon /></ActionButton>
                                                    {/* delete:owner, moderator, admin */}
                                                    <ActionDelete // 删除首贴会自动删除整个话题（目前是这个规则）
                                                        confirmContent='你确定要删除这篇话题及其所有的回复吗？'
                                                        post={firstPost}
                                                        onDeleted={() => router.replace('/')}
                                                    />
                                                    {/* let discussion stay top of the discussion list: admin, moderator */}
                                                    {(isAdmin || isModerator) && <ActionSticky discussion={discussion} onSticky={(sticky) => { setIsSticky(sticky); discussion.isSticky = sticky; }} />}
                                                    {/* lock all: admin, owner, moderator */}
                                                    <ActionLock discussion={discussion} onLocked={handleLockClick}><LockIcon /></ActionLock>
                                                </>
                                            }
                                        </>
                                    ) :
                                    (
                                        isAuthenticated && <ActionButton onClick={() => setIsExpendAction(true)}><MoreIcon /></ActionButton>
                                    )
                            }
                        </div>
                    </div>
                )}
            </div>
        </Box>
    );
}
