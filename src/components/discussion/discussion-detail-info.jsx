'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import DateUtils from '@/lib/date-utils';
import { runIfFn } from '@/lib/fn';
import Box from '../ui/box';
import { Blank, Heart, Locked, Pined, Link as LinkIcon, Bookmark, Flag, EyeOff, Markup, UnBookmark, Pin, Lock, Edit, DeleteBin, Reply } from '../icons';
import SplitBall from '../ui/split-ball';
// import Tag from '../ui/tag';
import ActionButton from '../ui/action-button';
import ProseContent from '../ui/prose-content';
import ActionDelete from './action-delete';
import ActionSticky from './action-sticky';
import ActionLock from './action-lock';
import ActionReact from './action-react';
import ReactionGroup from '../ui/reaction-group';
import { reactionModal } from '@/lib/models';

/*
    line 1: [User Avatar] username | created At ｜ space ___________ space | user actions?: follow? report,
    line 2: title / tags
    line 3: post content
    line 4: discussion meta: replies, reactions, participants
    line 5: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function DiscussionDetailInfo({ discussion, onReplyClick }) {
    const router = useRouter();
    const { data, status } = useSession();
    const [isSticky, setIsSticky] = useState(discussion?.isSticky);
    const [isLocked, setIsLocked] = useState(discussion?.isLocked);
    const [reactions, setReactions] = useState(discussion?.firstPost?.reactions);

    const isAuthenticated = status === 'authenticated';
    const isOwner = isAuthenticated && data.user.id === discussion?.user.id;
    const isAdmin = isAuthenticated && data.user.isAdmin;
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
                            <span className='mr-1.5'><Image alt={c.name} src={c.icon} className='w-4 h-4 rounded' /></span> :
                            <span className='w-5 h-5 rounded mr-1.5' style={{ backgroundColor: `${c.color || 'bg-gray-300'}`, }}></span>
                        }
                        <Link href={`/c/${c?.slug}`} onClick={e => e.stopPropagation()} className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/{c?.name}</Link>
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
                    <span className='ml-1' />
                    {isSticky && (<span className='h-4 w-4 ml-0.5 text-green-400'><Pined /></span>)}
                    {isLocked && (<span className='h-3.5 w-3.5 ml-0.5 text-yellow-400'><Locked /></span>)}
                </div>
                <h3 className='inline text-xl font-bold break-words text-neutral-200'>{discussion.title}</h3>
                {/* <div className='flex flex-wrap gap-1 my-2'>
                    <Tag>News</Tag>
                    <Tag>Help</Tag>
                    <Tag>Function</Tag>
                    <Tag>Cheer</Tag>
                    <Tag>Great</Tag>
                </div> */}
                <ProseContent className='my-3' content={discussion.firstPost?.content} />
                <div className='text-xs inline-flex items-center justify-between text-gray-300'>
                    <ReactionGroup reactions={reactions} />
                    <div className='flex items-center gap-1'>
                        <ActionButton onClick={() => runIfFn(onReplyClick)}><Reply /></ActionButton>
                        {/* give reaction  */}
                        <ActionReact post={discussion.firstPost} onReacted={handleUserReacted} />
                        {/* copy url to share  */}
                        {/* <ActionButton><LinkIcon /></ActionButton> */}
                        {/* save to bookmark */}
                        {/* <ActionButton><Bookmark /></ActionButton>
                            <ActionButton><UnBookmark /></ActionButton> */}
                        {/* report: owner, moderator and the user who has reported don't show this flag icon */}
                        {/* <ActionButton><Flag /></ActionButton> */}
                        {/* hide */}
                        {/* <ActionButton><EyeOff /></ActionButton> */}
                        {(isOwner || isAdmin) &&
                            <>
                                {/* define this port: owner, moderator. multi choose, items: spoiler(剧透)，NSFW(少儿不宜)，fake（假的），approved（实锤），spam（水贴）, OC（原创）, official（官方）*/}
                                {/* <ActionButton><Markup /></ActionButton> */}
                                {/* let discussion stay top of the discussion list: owner, moderator */}
                                <ActionSticky discussion={discussion} onSticky={(sticky) => { setIsSticky(sticky); discussion.isSticky = sticky; }} />
                                {/* lock all: owner, moderator */}
                                <ActionLock discussion={discussion} onLocked={(lock) => { setIsLocked(lock); discussion.isLocked = lock; }}><Lock /></ActionLock>
                                {/* edit:owner, moderator */}
                                <ActionButton><Edit /></ActionButton>
                                {/* delete:owner, moderator */}
                                <ActionDelete // 删除首贴会自动删除整个讨论（目前是这个规则）
                                    confirmContent='你确定要删除这篇讨论及其所有的回复吗？'
                                    post={discussion.firstPost} onDeleted={() => router.replace('/')}
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        </Box>
    );
}
