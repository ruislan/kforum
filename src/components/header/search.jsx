'use client';
import { Search as SearchIcon } from '../icons';

// 点击弹出搜索层，然后进行搜索，不用单独页面
export default function Search() {
    return (
        <div className='flex items-center text-sm focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400 sm:w-60'>
            <span className='h-4 w-4 mr-2'><SearchIcon /></span>
            <input type='text' placeholder='搜索...' className='w-full text-neutral-200 bg-transparent outline-none' />
        </div>
    );
}
