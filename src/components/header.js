import prisma from '@/lib/prisma';
import NavMenus from '@/components/nav-menus';

async function getMenus() {
    return await prisma.webNavMenus.findMany({ orderBy: { sequence: 'asc' } });
}

export default async function Header() {
    const menus = await getMenus();
    return (
        <header className='h-12 w-full fixed bg-neutral-800 border-solid border-b border-neutral-700 z-50'>
            <nav className='flex items-center h-full w-full max-w-5xl m-auto '>
                <a href='/' className='font-bold text-lg mr-6 flex items-center'>
                    <span>K</span>
                    <span>Forum</span>
                </a>
                <NavMenus menus={menus} />
                <div className='flex items-center flex-grow justify-end'>
                    {/* current category/subcategory/subsub/subsubsub... */}
                    {/* search */}
                    {/* user menus */}
                    <span>注册</span>
                    <span>登陆</span>
                </div>
            </nav>
        </header>
    );
}
