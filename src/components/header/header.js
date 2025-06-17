import dynamicImport from 'next/dynamic';
import { getServerSession } from 'next-auth';

import { notificationModel, siteNavMenuModel, siteSettingModel } from '@/models';
import authOptions from '@/lib/auth';

const ActionMenus = dynamicImport(() => import('@/components/header/action-menus'));
const NavMenus = dynamicImport(() => import('@/components/header/nav-menus'));
const Search = dynamicImport(() => import('@/components/header/search'));
const UserMenus = dynamicImport(() => import('@/components/header/user-menus'));

export default async function Header() {
    const session = await getServerSession(authOptions);
    const [menus, logo, unreadCount] = await Promise.all([
        siteNavMenuModel.getMenus(),
        siteSettingModel.getFieldValue(siteSettingModel.fields.siteLogo),
        notificationModel.getUnreadCount({ user: session?.user })
    ]);

    return (
        <header className='h-12 w-full md:px-0 px-4 fixed bg-neutral-800 border-solid border-b border-neutral-700 z-50'>
            <nav className='flex items-center h-full w-full max-w-5xl m-auto'>
                <NavMenus logo={logo} menus={menus} />
                <div className='flex items-center flex-grow justify-end gap-2'>
                    <Search />
                    <ActionMenus unreadCount={unreadCount} />
                    <UserMenus />
                </div>
            </nav>
        </header>
    );
}
