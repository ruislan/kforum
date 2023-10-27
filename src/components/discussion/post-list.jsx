'use client';
import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Box from '../ui/box';
import { Heart, Link as LinkIcon, Flag, Markup, Edit, DeleteBin, Reply, ArrowDownS, ArrowUpS, LoadingIcon } from '../icons';
import SplitBall from '../ui/split-ball';
import DateUtils from '@/lib/date-utils';
import ProseContent from '../ui/prose-content';
import { runIfFn } from '@/lib/fn';
import { useSession } from 'next-auth/react';
import ActionButton from '../ui/action-button';
import ActionDelete from './action-delete';
import ActionReact from './action-react';
import ReactionGroup from '../ui/reaction-group';

function NoContent() {
    return (
        <Box className='h-16 flex justify-center items-center'>
            <span className='text-base font-bold text-neutral-400'>还没有内容，就等你来回帖啦</span>
        </Box>
    );
}

function PostReplyContent({ replyPost }) {
    const limit = 100;
    const [expend, setExpend] = useState(false);
    const toggleExpend = async () => setExpend(prev => !prev);
    if (!replyPost) return null;
    return (
        <div className='flex mt-2 bg-neutral-700 rounded-r-md'>
            <div className='w-1 h-full bg-neutral-400'></div>
            <div className='p-2 w-full'>
                <div className='flex items-center justify-between mb-2 text-gray-300'>
                    <div className='flex items-center'>
                        <div className='w-5 h-5 mr-1.5 bg-gray-300 rounded'><img className='w-full h-full rounded' src={replyPost.user.avatar} alt={replyPost.user.name} /></div>
                        <Link href={`/u/${replyPost.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{replyPost.user.name}</Link>
                    </div>
                    {replyPost.text.length > limit && <div className='flex items-center'>
                        <span className='w-4 h-4 cursor-pointer' onClick={e => {
                            e.preventDefault();
                            toggleExpend();
                        }}>{expend ? <ArrowUpS /> : <ArrowDownS />}</span>
                    </div>}
                </div>
                <div className={expend ? '' : 'max-h-[64px] overflow-hidden'}>
                    <ProseContent isSummary={!expend} limit={limit} content={replyPost.text} />
                </div>
            </div>
        </div>
    );
}

function PostItem({ post, onReplyClick }) {
    const { data, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const isOwner = isAuthenticated && data.user.id === post.user.id;
    const isAdmin = isAuthenticated && data.user.isAdmin;
    const [reactions, setReactions] = useState(post?.reactions);
    const [isDeleted, setIsDeleted] = useState(false);

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

    if (!post) return null;

    return (
        <div className='flex'>
            <div className='flex flex-col items-center mr-2'>
                <div className='w-9 h-9 bg-gray-300 rounded'><img className='w-full h-full rounded' src={post.user.avatar} alt={post.user.name} /></div>
                {/* click line to collapse post replies */}
                {!isDeleted && <div className='mt-2 my-1 border-l-2 border-neutral-600 h-full cursor-pointer hover:border-neutral-300' />}
            </div>
            {isDeleted ? <div className='flex items-center text-sm text-gray-400'>内容已经被删除</div>
                : <div className='flex flex-col flex-1'>
                    <div className='flex items-center text-gray-300'>
                        <Link href={`/u/${post.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/{post.user.name}</Link>
                        <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                        <span className='text-xs'>{DateUtils.fromNow(post.createdAt)}</span>
                    </div>
                    <PostReplyContent replyPost={post.replyPost} />
                    <ProseContent className='my-1' content={post.content} />
                    <div className='text-xs inline-flex items-center justify-between text-gray-300'>
                        <ReactionGroup reactions={reactions} />
                        <div className='flex items-center gap-1'>
                            {/* reply  */}
                            <ActionButton onClick={() => runIfFn(onReplyClick, { post })}><Reply /></ActionButton>
                            {/* give reaction  */}
                            <ActionReact post={post} onReacted={handleUserReacted} />
                            {/* copy url to share  */}
                            {/* <ActionButton><LinkIcon /></ActionButton> */}
                            {/* report: owner, moderator and the user who has reported don't show this flag icon */}
                            {/* <ActionButton><Flag /></ActionButton> */}
                            {/* define this port: owner, moderator. multi choose, items: spoiler(剧透)，NSFW(少儿不宜)，fake（假的），approved（实锤），spam（水贴）, OC（原创）, official（官方）*/}
                            {/* <ActionButton><Markup /></ActionButton> */}
                            {(isOwner || isAdmin) &&
                                <>
                                    {/* edit:owner, moderator */}
                                    <ActionButton><Edit /></ActionButton>
                                    {/* delete:owner, moderator */}
                                    <ActionDelete post={post} onDeleted={() => setIsDeleted(true)} />
                                </>
                            }
                        </div>
                    </div>
                </div>}
        </div>
    );
}

/*
    line 1: [User Avatar] username | created At | last edit at,
    line 2: post content
    line 3: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function PostList({ posts, onReplyClick }) {
    if (!posts || posts.length === 0) return <NoContent />;
    return (
        <Box className='flex flex-col gap-3 pb-2'>
            {posts?.map((post, i) => <PostItem key={i} post={post} onReplyClick={onReplyClick} />)}
        </Box>
    );
}
