import Link from 'next/link';

import prisma from '@/lib/prisma';
import NavMenus from '@/components/header/nav-menus';

import Search from './search';
import UserMenus from './user-menus';
import { Plus } from '../icons';

async function getMenus() {
    return await prisma.siteNavMenus.findMany({ orderBy: { sequence: 'asc' } });
}

export default async function Header() {
    const menus = await getMenus();
    return (
        <header className='h-12 w-full fixed bg-neutral-800 border-solid border-b border-neutral-700 z-50'>
            <nav className='flex items-center h-full w-full max-w-5xl m-auto '>
                <Link href='/' className='relative font-bold text-lg text-white mr-4 flex items-center group'>
                    <div className='absolute w-9 h-9 rounded-md bg-neutral-600 shadow-lg left-0 group-hover:w-full transition-[width]'></div>
                    <span className='z-10 w-9 h-9 text-xl flex justify-center items-center mr-1 group-hover:-rotate-12 transition-all duration-500'>K</span>
                    <span className='z-10 pr-3'>Forum</span>
                </Link>
                <NavMenus menus={menus} />
                <div className='flex items-center flex-grow justify-end gap-4'>
                    <Search />
                    <Link href='/d/create' className='flex items-center justify-center w-9 h-9 text-gray-300 p-4 hover:bg-neutral-700 rounded-md'>
                        <span className='flex w-7 h-7'><Plus /></span></Link>
                    <UserMenus />
                </div>
            </nav>
        </header>
    );
}
