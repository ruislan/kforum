'use client';
import clsx from 'clsx';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';

import { Close, Search as SearchIcon } from '../icons';

function SearchAction({ prefix, type, query }) {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                let url = `/search?q=${query}`;
                if (type) url += `&type=${type}`;
                router.push(url);
            }}
            className={clsx(
                'flex gap-0.5 items-center cursor-pointer w-full',
                'hover:bg-neutral-700 p-2'
            )}
        >
            <span className='font-semibold min-w-fit'>{prefix}</span>
            <span>&#34;</span>
            <span className='truncate'>{query}</span>
            <span>&#34;</span>
        </div>
    );
}

function DropdownContent({ query, isFocus }) {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (!isFocus) setIsOpen(false);
        else setIsOpen(query?.length > 0);
    }, [query, isFocus]);

    return (
        <div className='relative'>
            <Transition
                as={Fragment}
                appear
                show={isOpen}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
            >
                <div
                    className={clsx(
                        'absolute z-10 mt-2 top-0.5 min-h-fit left-0 w-full',
                        'flex flex-col bg-neutral-800',
                        'text-sm text-neutral-200',
                        'border border-solid border-neutral-700 rounded-md shadow-xl'
                    )}
                >
                    <SearchAction prefix='话题' type='default' query={query} />
                    <SearchAction prefix='帖子' type='posts' query={query} />
                    <SearchAction prefix='用户' type='users' query={query} />
                </div>
            </Transition>
        </div>
    );
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const router = useRouter();
    return (
        <div onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}>
            <div
                className={clsx(
                    'flex items-center text-sm focus:outline-none transition-all',
                    'bg-neutral-800 p-2 border border-solid border-neutral-700',
                    'rounded-md focus-within:border-neutral-400 w-32 sm:w-72'
                )}
            >
                <span className='h-4 w-4 min-w-[16px] mr-2'><SearchIcon /></span>
                <input
                    onKeyUp={e => {
                        if (e.key === 'Enter') {
                            router.push(`/search?q=${query}`);
                            e.target.blur();
                        }
                    }}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    type='text'
                    placeholder='搜索...'
                    className='w-full text-neutral-200 bg-transparent outline-none'
                />
                {query?.length > 0 && isFocus && (
                    <div className='flex min-w-fit ml-2'>
                        <span
                            className='w-4 h-4 cursor-pointer'
                            onMouseDown={e => {
                                e.preventDefault();
                                setQuery('');
                            }}
                        >
                            <Close />
                        </span>
                    </div>
                )}
            </div>
            <DropdownContent query={query} isFocus={isFocus} />
        </div>
    );
}
