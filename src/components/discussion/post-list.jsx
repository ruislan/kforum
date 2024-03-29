'use client';
import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import dateUtils from '@/lib/date-utils';
import { runIfFn } from '@/lib/fn';
import Box from '../ui/box';
import SplitBall from '../ui/split-ball';
import ProseContent from '../ui/prose-content';
import ActionButton from '../ui/action-button';
import ReactionGroup from '../ui/reaction-group';
import NoContent from '../ui/no-content';
import Button from '../ui/button';
import Spinner from '../ui/spinner';
import UserMark from '../ui/user-mark';
import UserAvatar from '../ui/user-avatar';
import { EditIcon, ArrowDownSIcon, ArrowUpSIcon, MoreIcon } from '../icons';
import ActionDelete from './action-delete';
import ActionReact from './action-react';
import ActionReply from './action-reply';
import PostUpdater from './post-updater';
import ActionReport from './action-report';
import ActionBookmark from './action-bookmark';
import ActionCopyLink from './action-copy-link';
import UserFancyLink from '../user/user-fancy-link';

export function PostReplyContent({ replyPost }) {
    const limit = 100;
    const [expend, setExpend] = useState(false);
    const toggleExpend = async () => setExpend(prev => !prev);
    if (!replyPost) return null;
    return (
        <div className='flex mt-2 bg-neutral-500/20 rounded-r-md'>
            <div className='w-1 h-full bg-neutral-600'></div>
            <div className='p-2 w-full'>
                <div className='flex items-center justify-between mb-2 text-gray-300'>
                    <div className='flex items-center'>
                        <UserAvatar
                            className='mr-1.5'
                            size='xs'
                            name={replyPost.user.name}
                            avatar={replyPost.user.avatarUrl}
                        />
                        <UserFancyLink user={replyPost.user} />
                    </div>
                    {replyPost.text.length > limit && <div className='flex items-center'>
                        <span className='w-4 h-4 cursor-pointer' onClick={e => {
                            e.preventDefault();
                            toggleExpend();
                        }}>{expend ? <ArrowUpSIcon /> : <ArrowDownSIcon />}</span>
                    </div>}
                </div>
                <div className={expend ? '' : 'max-h-[64px] overflow-hidden'}>
                    <ProseContent
                        isSummary={!expend}
                        limit={limit}
                        content={replyPost.deletedAt ? '该帖子已经被删除' : replyPost.content}
                    />
                </div>
            </div>
        </div>
    );
}

function PostItem({
    isDiscussionLocked,
    item,
    onReplyClick
}) {
    const { data, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const isOwner = isAuthenticated && data.user.id === item.user.id;
    const isAdmin = isAuthenticated && data.user.isAdmin;
    const isModerator = isAuthenticated && data.user.isModerator;
    const [post, setPost] = useState(item);
    const [reactions, setReactions] = useState(item.reactions || []);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isExpendAction, setIsExpendAction] = useState(false);

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

    if (!item) return null;

    return (
        <div className='flex'>
            <div className='flex flex-col items-center mr-2'>
                <UserAvatar name={post.user.name} avatar={post.user.avatarUrl} />
                {/* click line to collapse post replies */}
                {!isDeleted && <div className='mt-2 my-1 border-l-2 border-neutral-600 h-full cursor-pointer hover:border-neutral-300' />}
            </div>
            {isDeleted ? <div className='flex items-center text-sm text-gray-400'>内容已经被删除</div>
                : <div className='flex flex-col flex-1'>
                    <div className='flex items-center text-gray-300'>
                        <UserFancyLink user={post.user} />
                        <UserMark isAdmin={post.user.isAdmin} isModerator={post.user.isModerator} isLocked={post.user.isLocked} />
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='text-xs' suppressHydrationWarning>{dateUtils.fromNow(post.createdAt)}</span>
                    </div>
                    <PostReplyContent replyPost={post.replyPost} />
                    {isEditMode ?
                        <PostUpdater
                            post={post}
                            onUpdated={({ content, text }) => {
                                setPost({ ...post, content, text });
                                setIsEditMode(false);
                            }}
                            onCanceled={() => setIsEditMode(false)}
                        /> :
                        <ProseContent className='my-1' content={post.content} />
                    }
                    {!isEditMode && (
                        <div className='text-xs inline-flex flex-col items-end gap-1 mt-1 md:flex-row md:items-center md:justify-between text-gray-300'>
                            <ReactionGroup reactions={reactions} />
                            <div className='flex items-center flex-wrap self-end gap-1'>
                                {/* reply  */}
                                {!isDiscussionLocked && <ActionReply onClick={() => runIfFn(onReplyClick, { post })} />}
                                {/* give reaction  */}
                                <ActionReact post={post} onReacted={handleUserReacted} />
                                <ActionBookmark post={post} />
                                {/* copy url to share  */}
                                <ActionCopyLink post={post} />
                                {
                                    isExpendAction ?
                                        (<>
                                            {isAuthenticated && <ActionReport post={post} />}
                                            {(isOwner || isAdmin || isModerator) &&
                                                <>
                                                    {/* edit:owner, moderator */}
                                                    <ActionButton onClick={() => setIsEditMode(true)}><EditIcon /></ActionButton>
                                                    {/* delete:owner, moderator */}
                                                    <ActionDelete post={post} onDeleted={() => setIsDeleted(true)} />
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
                </div>}
        </div>
    );
}

/*
    line 1: [User Avatar] username | created At | last edit at,
    line 2: post content
    line 3: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function PostList({
    isDiscussionLocked,
    isLoading,
    posts,
    hasMore,
    onMoreClick,
    onReplyClick
}) {
    if (!isLoading && (!posts || posts.length === 0)) return <NoContent text='还没有内容，就等你来回复啦' />;
    return (
        <>
            {posts.length > 0 &&
                <Box className='flex flex-col gap-3 pb-2'>
                    {posts?.map((post, i) =>
                        <PostItem
                            key={i}
                            isDiscussionLocked={isDiscussionLocked}
                            item={post}
                            onReplyClick={onReplyClick}
                        />
                    )}
                </Box>
            }
            {isLoading && <Spinner center />}
            {hasMore && !isLoading && (
                <div className='self-center py-2'>
                    <Button kind='ghost' disabled={isLoading} onClick={onMoreClick}>查看更多</Button>
                </div>
            )}
        </>
    );
}
