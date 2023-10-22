import { getServerSession } from 'next-auth';

import Header from '@/components/header/header';
import Providers from '@/components/providers';
import './globals.css';
import LoginModal from '@/components/login-modal';
import RegisterModal from '@/components/register-modal';

export const metadata = {
  title: 'KForum',
  description: 'Simple, Modern, Beautiful and Fast',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        <Providers session={session}>
          <Header />
          <div className='mx-auto max-w-5xl flex md:pt-12 md:pl-0 md:pr-0 pl-4 pr-4'>
            <div className='flex my-5 min-h-screen w-full'>
              {children}
            </div>
          </div>
          {/* <Footer /> */}
          <LoginModal />
          <RegisterModal />
        </Providers>
      </body>
    </html>
  )
}
