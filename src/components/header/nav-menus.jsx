'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { usePathname } from 'next/navigation';



export default function NavMenus({ menus }) {
    const pathname = usePathname() || '/';

    return (
        <div className='flex items-center gap-4 overflow-hidden max-w-xs py-1 h-full'>
            {menus.map(({ url, name, isTargetBlank }) => (
                <Link
                    key={url}
                    href={url}
                    target={isTargetBlank ? '_blank' : '_self'}
                    className={clsx(
                        'font-semibold transition-all hover:text-neutral-100 no-underline',
                        'whitespace-nowrap overflow-hidden min-w-fit',
                        pathname === url ? 'text-neutral-100' : 'text-neutral-400'
                    )}
                >
                    {name}
                </Link>
            ))}
        </div>
    );
}