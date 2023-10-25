'use client';
import { useState } from 'react';
import DiscussionDetailInfo from './discussion-detail-info';
import PostCreator from './post-creator';
import PostList from './post-list';

export default function DiscussionDetail({ discussion }) {
    const [posts, setPosts] = useState(discussion.posts || []);
    const [replyToPost, setReplyToPost] = useState(null);

    const changeReplyToPost = (post, focus = true) => setReplyToPost({ ...post, clickTime: new Date(), focus }); // 加这个clickTime用于区分在不同时间点击同一个帖子
    return (
        <>
            <DiscussionDetailInfo discussion={discussion} onReplyClick={() => changeReplyToPost({ ...discussion.firstPost, isFirst: true })} />
            <PostList posts={posts} onReplyClick={({ post }) => changeReplyToPost(post)} />
            <PostCreator discussion={discussion} replyToPost={replyToPost} onCreated={({ post }) => {
                setPosts([...posts, post]);
                changeReplyToPost({ ...discussion.firstPost, isFirst: true }, false);
            }} />
        </>
    );
}