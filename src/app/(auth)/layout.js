import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import authOptions from '@/lib/auth';

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');
  return (
    <div className='flex w-full min-h-screen'>
      <div className='w-96 bg-[url("/board-art.jpeg")] bg-no-repeat bg-cover bg-center' />
      <div className='self-center p-8 w-96'>
        {children}
      </div>
    </div>
  );
}
