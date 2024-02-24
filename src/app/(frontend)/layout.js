import dynamicImport from 'next/dynamic';

import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';

import authOptions from '@/lib/auth';
import Providers from '@/components/providers';
import LoginModal from '@/components/auth/login-modal';
import RegisterModal from '@/components/auth/register-modal';

const Header = dynamicImport(() => import('@/components/header/header'));
const Footer = dynamicImport(() => import('@/components/footer/footer'));

export default async function Layout({ children }) {
    const session = await getServerSession(authOptions);

    return (
        <Providers session={session}>
            <Header />
            <div className='mx-auto max-w-5xl flex pt-12 md:pl-0 md:pr-0 pl-4 pr-4'>
                <div className='flex my-5 min-h-screen w-full'>
                    {children}
                </div>
            </div>
            <Footer />
            <Toaster />
            <LoginModal />
            <RegisterModal />
        </Providers>
    )
}
