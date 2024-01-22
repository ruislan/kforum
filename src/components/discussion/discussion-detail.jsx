'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import DiscussionDetailInfo from './discussion-detail-info';
import PostCreator from './post-creator';
import PostList from './post-list';
import Box from '../ui/box';

export default function DiscussionDetail({ discussion }) {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [posts, setPosts] = useState([]);
    const [replyToPost, setReplyToPost] = useState(null);
    const [isLocked, setIsLocked] = useState(discussion.isLocked);

    const changeReplyToPost = async (post, focus = true) => {
        setReplyToPost({
            ...post,
            clickTime: new Date(), // 加这个clickTime用于区分在不同时间点击同一个帖子
            focus
        });
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/posts?discussionId=${discussion.id}&page=${page}`);
                if (res.ok) {
                    const json = await res.json();
                    setPosts(prev => page < 2 ? json.data : [...prev, ...json.data]);
                    setHasMore(json.hasMore);
                } else {
                    toast.error('未知错误，请刷新重试');
                }
            } catch (err) {
                toast.error('未知错误，请刷新重试');
            } finally {
                setIsLoading(false);
            }
        })();

    }, [page, discussion.id]);

    return (
        <>
            <DiscussionDetailInfo
                discussion={discussion}
                onReplyClick={() => changeReplyToPost({ ...discussion.firstPost, isFirst: true })}
                onLockClick={(lock) => setIsLocked(lock)}
            />
            <PostList
                posts={posts}
                isLoading={isLoading}
                isDiscussionLocked={isLocked}
                hasMore={hasMore}
                onMoreClick={() => setPage(prev => prev + 1)}
                onReplyClick={({ post }) => changeReplyToPost(post)}
            />
            {isLocked ?
                <Box className='h-16 flex justify-center items-center'>
                    <span className='text-base font-bold text-neutral-400'>该话题已经锁定</span>
                </Box> :
                <PostCreator discussion={discussion} replyToPost={replyToPost} onCreated={({ post }) => {
                    setPosts([...posts, post]);
                    changeReplyToPost({ ...discussion.firstPost, isFirst: true }, false);
                }} />
            }
        </>
    );
}