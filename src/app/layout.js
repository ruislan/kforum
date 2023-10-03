import './globals.css';

import Header from './header';

export const metadata = {
  title: 'KForum',
  description: 'Simple, Modern, Beautiful and Fast',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        <Header />
        <div className='mx-auto max-w-6xl flex flex-col pl-4 pr-4 md:p-0'>
          {/* left side categories */}
          {/* main container:
              1) discussions
                center: filter[best(?), hot(一段时间内活跃最多), top(置顶), new(最新创建), rising(和hot要有区别，是什么呢？)] / discussion list
                right: create discussion / recent posted discussions
              2) discussion/[id]
                center: discussion / posts / create post(reply someone?)
                right side: about discussion (some meta) / related discussions
              3) user/[id]
                center: summary / activity / badge / notification  (user himself) / settings (user himself)
              4) ...
           */}
            {children}
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
