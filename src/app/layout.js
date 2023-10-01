import './globals.css';

export const metadata = {
  title: 'KForum',
  description: 'Simple, Modern, Beautiful and Fast',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        <main className='mx-auto max-w-2xl flex flex-col pl-4 pr-4 md:p-0'>
          {/* <Header /> */}
          <div className='my-8'>
            {children}
          </div>
          {/* <Footer /> */}
        </main>
      </body>
    </html>
  )
}
