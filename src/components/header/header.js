import dynamicImport from 'next/dynamic';
import { siteNavMenuModel, siteSettingModel } from '@/models';
import ActionMenus from './action-menus';

const NavMenus = dynamicImport(() => import('@/components/header/nav-menus'));
const Search = dynamicImport(() => import('@/components/header/search'));
const UserMenus = dynamicImport(() => import('@/components/header/user-menus'));

async function getMenus() {
    return await siteNavMenuModel.getMenus();
}
async function getLogo() {
    return await siteSettingModel.getFieldValue(siteSettingModel.fields.siteLogo);
}

export default async function Header() {
    const menus = await getMenus();
    const logo = await getLogo();
    return (
        <header className='h-12 w-full md:px-0 px-4 fixed bg-neutral-800 border-solid border-b border-neutral-700 z-50'>
            <nav className='flex items-center h-full w-full max-w-5xl m-auto'>
                <NavMenus logo={logo} menus={menus} />
                <div className='flex items-center flex-grow justify-end gap-2'>
                    <Search />
                    <ActionMenus />
                    <UserMenus />
                </div>
            </nav>
        </header>
    );
}
