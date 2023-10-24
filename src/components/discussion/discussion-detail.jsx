'use client';
import { useState } from "react";
import DiscussionDetailInfo from "./discussion-detail-info";
import PostCreator from "./post-creator";
import PostList from "./post-list";

export default function DiscussionDetail({ discussion }) {
    const [posts, setPosts] = useState(discussion.posts || []);
    const [replyToPost, setReplyToPost] = useState(null);
    return (
        <>
            <DiscussionDetailInfo discussion={discussion} />
            <PostList posts={posts} />
            <PostCreator discussion={discussion} replyToPost={replyToPost} onCreated={({ post }) => {
                setPosts([...posts, post]);
            }} />
        </>
    );
}