import dynamicImport from 'next/dynamic';

const NavMenus = dynamicImport(() => import('@/components/admin-panel/nav-menus'));

export default async function Page() {
    return (
        <NavMenus />
    );
}