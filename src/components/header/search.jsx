'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from '../icons';

export default function Search() {
    const [query, setQuery] = useState('');
    const router = useRouter();
    return (
        <div className='flex items-center text-sm focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400 sm:w-60'>
            <span className='h-4 w-4 mr-2'><SearchIcon /></span>
            <input
                onKeyUp={e => {
                    if (e.key === 'Enter') {
                        router.push(`/search?q=${query}`);
                    }
                }}
                value={query}
                onChange={e => setQuery(e.target.value)}
                type='text'
                placeholder='搜索...'
                className='w-full text-neutral-200 bg-transparent outline-none'
            />
        </div>
    );
}
