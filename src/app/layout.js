import './globals.css';

export const metadata = {
  title: 'KForum',
  description: 'Simple, Modern, Beautiful and Fast',
}

export default async function RootLayout({ children }) {
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        {children}
      </body>
    </html>
  )
}
