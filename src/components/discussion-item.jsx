'use client';
import Link from 'next/link';
import Box from './ui/box';
import { Blank, Lock, Locked, Pin, Pined, Post as PostIcon } from './icons';
import SplitBall from './split-ball';
import Tag from './ui/tag';

/*
    line 1: [User Avatar] username | created At ｜ space ___________ space | user actions?: follow? report,
    line 2: title / tags
    line 3: post content
    line 4: discussion meta: replies, reactions, participants
    line 5: actions: reply, edit, delete, share, follow, favorite, report
*/
export default function DiscussionItem({ data }) {
    return (
        <Box className='flex flex-col hover:border-neutral-500 cursor-pointer' onClick={() => location.href = '/d/' + data.id}>
            <div className='flex flex-col flex-1'>
                <div className='flex items-center mb-3 text-gray-300'>
                    {/* hide category if user is in the category */}
                    <div className='flex items-center'>
                        <span className='w-6 h-6 bg-gray-300 rounded mr-1.5'><Blank /></span>
                        <Link href={`/c/general`} onClick={e => e.stopPropagation()} className='text-xs text-gray-50 hover:underline underline-offset-2 cursor-pointer'>c/综合分类</Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'>
                        <div className='w-6 h-6 mr-1.5 bg-gray-300 rounded'><img className='w-full h-full rounded' src={data.user.avatar} alt={data.user.name} /></div>
                        <Link href={`/u/${data.user.name}`} onClick={e => e.stopPropagation()} className='text-xs hover:underline underline-offset-2 cursor-pointer'>u/例子</Link>
                    </div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='text-xs'>{' 1 天前'}</span>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <span className='h-4 w-4 mr-0.5'><Locked /></span>
                    <span className='h-4 w-4 mr-1.5'><Pined /></span>
                </div>
                <div className='inline-block relative'>
                    <h3 className='inline text-lg font-bold break-words'>fdasfldsafjdsafd;sagjdjgadsjfdks;fjgj geqefsjkdafds a fdsafdjskalfdjsaf ds fdsafdsa fdafs</h3>
                    <Tag className='ml-1'>News</Tag>
                    <Tag className='ml-1'>Help</Tag>
                    <Tag className='ml-1'>Function</Tag>
                    <Tag className='ml-1'>Cheer</Tag>
                    <Tag className='ml-1'>Great</Tag>
                </div>
                <div className='mt-2 max-h-64 overflow-hidden break-words content-mask-b text-sm'>
                    <p>
                        I'm creating a website where I want to add authentication with email and Google provider, The problem is I also want to add email verification code but don't know if it's possible along with Google provider . Please 🙏🏻 give any suggestions or recommendations.
                    </p>
                </div>
                <div className='text-xs inline-flex items-center text-gray-300 mt-3'>
                    <div className='flex items-center'><span>参与 411</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>回复 12.3k</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>{'反馈 121'}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>{'浏览 121.4k'}</span></div>
                    <SplitBall className='ml-1.5 mr-1.5 bg-gray-300' />
                    <div className='flex items-center'><span>{'分享 1.4k'}</span></div>
                </div>
            </div>
        </Box>
    );
}
