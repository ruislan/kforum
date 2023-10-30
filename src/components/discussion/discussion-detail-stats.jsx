'use client';

import { useMemo } from 'react';
import { maxBy } from 'lodash';
import Box from '../ui/box';
import Reaction from '../ui/reaction';

export default function DiscussionStats({ discussion }) {
    const reaction = useMemo(() => maxBy(discussion.firstPost.reactions, 'count'), [discussion.firstPost.reactions]);
    return (
        <Box className='flex flex-col'>
            <h3 className='text-sm text-gray-400 font-bold mb-3'>话题分析</h3>
            {/* trend ? */}
            {/* positive vs negative ? */}
            <div className='grid grid-cols-3 gap-2 mt-2'>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>参与数</div>
                    <div className='text-gray-400'>{discussion.userCount}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>回复数</div>
                    <div className='text-gray-400'>{discussion.postCount}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>反馈数</div>
                    <div className='text-gray-400'>{discussion.reactionCount}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>浏览数</div>
                    <div className='text-gray-400'>{discussion.viewCount}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>最新回复</div>
                    <div className='text-gray-400'>{new Date(discussion.lastPost?.createdAt).toLocaleDateString()}</div>
                </div>
                <div className='flex flex-col text-sm'>
                    <div className='text-gray-100'>最多反馈</div>
                    <div className='text-gray-400'>
                        {reaction ? <Reaction data={reaction} /> : '-'}
                    </div>
                </div>
            </div>
        </Box>
    );
}