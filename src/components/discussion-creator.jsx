'use client';
import Box from './ui/box';
import Button from './ui/button';
import Tiptap from './ui/tiptap';

// 点击弹出搜索层，然后进行搜索，不用单独页面
export default function DiscussionCreator({ categories }) {
    return (
        <Box className='flex flex-col w-full gap-2'>
            <div className='text-sm focus:outline-none bg-neutral-800 p-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                <select className='w-full text-neutral-200 bg-transparent outline-none '>
                    <option>选择分类</option>
                    {categories.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
            </div>
            {/* input */}
            <div className='flex items-center text-sm focus:outline-none bg-neutral-800 p-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
                <input type='text' placeholder='起一个不错的标题吧...' className='w-full text-neutral-200 bg-transparent outline-none' />
                <span className='text-xs ml-2 text-neutral-500'>5/300</span>
            </div>
            <Tiptap kind='default' />
            <div className='flex justify-end'>
                <Button>发布</Button>
            </div>
        </Box>
    );
}
