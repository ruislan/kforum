import dynamicImport from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import { notFound } from 'next/navigation';

import authOptions from '@/lib/auth';
import Providers from '@/components/providers';

const SideNav = dynamicImport(() => import('@/components/ui/side-nav'));
const Footer = dynamicImport(() => import('@/components/footer/footer'));
const Header = dynamicImport(() => import('@/components/header/header'));

function getSideMenus(user) {
    const menus = [
        { label: '概览', path: '/admin-panel' },
        { label: '举报处理', path: '/admin-panel/reports' },
        { label: '标签管理', path: '/admin-panel/tags' },
    ];

    if (user.isAdmin) {
        menus.push({ label: '用户管理', path: '/admin-panel/users' });
        menus.push({ label: '站点设置', path: '/admin-panel/site' });
        menus.push({ label: '导航设置', path: '/admin-panel/menus' });
    }
    return menus;
}

export const metadata = {
    title: '管理'
};

export default async function Layout({ children }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin && !session?.user?.isModerator) notFound();
    const menus = getSideMenus(session?.user);

    return (
        <Providers session={session}>
            <Header />
            <div className='mx-auto max-w-5xl flex pt-12 md:pl-0 md:pr-0 pl-4 pr-4'>
                <div className='flex md:flex-row flex-col my-5 min-h-screen w-full gap-6'>
                    <div className='flex flex-col md:w-64 w-full gap-4'>
                        <SideNav menus={menus} />
                    </div>
                    <div className='flex flex-col flex-1 md:max-w-main'>
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
            <Toaster />
        </Providers>
    )
}
