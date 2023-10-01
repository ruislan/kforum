'use client';

import clsx from 'clsx';

import Link from 'next/link';
// import { usePathname } from 'next/navigation';

export default function Header({ menus }) {
    // let pathname = usePathname() || '/';

    return (
        <header>
            <nav className='flex flex-col md:flex-row md:items-center pt-8 pb-4 md:pb-8'>
                <a href='/' className='font-bold text-lg md:mr-6 mb-6 md:mb-0 flex items-center gap-1'>
                    <span className='w-6 h-6'>K</span>
                    <span>KForum</span>
                </a>
                <div className='flex flex-wrap items-center gap-4'>
                    {menus.map(({ path, name }) => {
                        return <Link key={path} href={path}
                            className={clsx(
                                'transition-all hover:text-white hover:underline underline-offset-4',
                                pathname === path ? 'text-white underline' : 'text-neutral-500'
                            )}>{name}</Link>
                    })}
                </div>
            </nav>
        </header>
    );
}
