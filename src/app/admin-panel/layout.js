import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import { notFound } from 'next/navigation';

import authOptions from '@/lib/auth';
import Header from '@/components/header/header';
import Providers from '@/components/providers';
import Footer from '@/components/footer/footer';
import SideNav from '@/components/settings/side-nav';

const menus = [
  { label: '概览', path: '/admin-panel' },
  { label: '举报处理', path: '/admin-panel/reports' },
  { label: '用户管理', path: '/admin-panel/users' },
  { label: '标签管理', path: '/admin-panel/tags' },
  { label: '站点设置', path: '/admin-panel/site' },
];

export const metadata = {
  title: '管理'
};

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) notFound();
  return (
    <Providers session={session}>
      <Header />
      <div className='mx-auto max-w-5xl flex md:pt-12 md:pl-0 md:pr-0 pl-4 pr-4'>
        <div className='flex my-5 min-h-screen w-full gap-6'>
          <div className='flex flex-col w-64 gap-4'>
            <SideNav menus={menus} />
          </div>
          <div className='flex flex-col flex-1'>
            {children}
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </Providers>
  )
}
