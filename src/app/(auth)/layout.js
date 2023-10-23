import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import '../globals.css';
import { redirect } from 'next/navigation';

export const metadata = {
  title: '登录 | KForum',
  description: 'Simple, Modern, Beautiful and Fast',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
          <div className='mx-auto max-w-5xl flex md:pt-12 md:pl-0 md:pr-0 pl-4 pr-4'>
            <div className='flex my-5 min-h-screen w-full'>
              {children}
            </div>
          </div>
          {/* <Footer /> */}
      </body>
    </html>
  )
}
