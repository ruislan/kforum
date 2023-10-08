import Header from '@/components/header';
import './globals.css';

export const metadata = {
  title: 'KForum',
  description: 'Simple, Modern, Beautiful and Fast',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        <Header />
        <div className='mx-auto max-w-6xl flex md:pt-14 md:pl-0 md:pr-0 pl-4 pr-4'>
          {children}
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
