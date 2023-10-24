import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '../api/auth/[...nextauth]/route';
import '../globals.css';

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        <div className='flex w-full min-h-screen'>
          <div className='w-96 bg-[url("/board-art.jpeg")] bg-no-repeat bg-cover bg-center' />
          <div className='self-center p-8 w-96'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
