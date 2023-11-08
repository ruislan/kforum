'use client';

import { useMemo } from 'react';
import { maxBy } from 'lodash';

import Box from '../ui/box';
import Reaction from '../ui/reaction';
import Stats from '../ui/stats';
import { HeadingSmall } from '../ui/heading';

export default function DiscussionStats({ discussion }) {
    const reaction = useMemo(() => maxBy(discussion.firstPost.reactions, 'count'), [discussion.firstPost.reactions]);
    return (
        <Box className='flex flex-col'>
            <HeadingSmall>话题分析</HeadingSmall>
            {/* trend ? */}
            {/* positive vs negative ? */}
            <div className='grid grid-cols-3 gap-2 mt-2'>
                <Stats name='参与数' value={discussion.userCount} />
                <Stats name='帖子数' value={discussion.postCount} />
                <Stats name='反馈数' value={discussion.reactionCount} />
                <Stats name='浏览数' value={discussion.viewCount} />
                <Stats name='最新回复' value={new Date(discussion.lastPost?.createdAt).toLocaleDateString()} />
                <Stats name='最多反馈' value={reaction ? <Reaction data={reaction} /> : '-'} />
            </div>
        </Box>
    );
}