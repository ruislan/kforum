'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMenus({ menus }) {
    const pathname = usePathname() || '/';
    return (
        <div className='flex flex-wrap items-center gap-4'>
            {menus.map(({ url, name }) => {
                return <Link key={url} href={url}
                    className={clsx(
                        'font-semibold transition-all hover:text-neutral-100 no-underline',
                        pathname === url ? 'text-neutral-100' : 'text-neutral-400'
                    )}>{name}</Link>
            })}
        </div>
    );
}