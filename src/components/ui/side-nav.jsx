'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

function MenuItem({ menu, isActive }) {
    if (!menu) return null;
    return (
        <Link
            href={menu.path}
            className={clsx(
                'transition-colors font-semibold hover:text-gray-100 hover:underline underline-offset-2',
                isActive ? 'text-gray-50 pointer-events-none cursor-none' : 'text-gray-400'
            )}>
            {menu.label}
        </Link>
    );
}

export default function SideNav({ menus }) {
    const pathname = usePathname() || '/';
    if (!menus) return null;
    return (
        <ul className='flex flex-col gap-2 p-2 text-base border border-neutral-700 bg-neutral-800 rounded-md'>
            {menus.map((menu, index) =>
                <li key={index}>
                    <MenuItem
                        menu={menu}
                        isActive={pathname === menu.path}
                    />
                </li>
            )}
        </ul>
    );
}