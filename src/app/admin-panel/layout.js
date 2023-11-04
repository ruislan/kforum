import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import { notFound } from 'next/navigation';

import authOptions from '@/lib/auth';
import Header from '@/components/header/header';
import Providers from '@/components/providers';
import Footer from '@/components/footer/footer';

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session.user?.isAdmin) notFound();
  return (
    <Providers session={session}>
      <Header />
      <div className='mx-auto max-w-5xl flex md:pt-12 md:pl-0 md:pr-0 pl-4 pr-4'>
        <div className='flex my-5 min-h-screen w-full'>
          {children}
        </div>
      </div>
      <Footer />
      <Toaster />
    </Providers>
  )
}
