import _ from 'lodash';
import { siteSettingModel } from '@/models';

import './globals.css';

async function getFavicon() {
  return await siteSettingModel.getFieldValue(siteSettingModel.fields.siteFavicon);
}

export async function generateMetadata({ params, searchParams }, parent) {
  const data = await siteSettingModel.getFieldsValues(
    siteSettingModel.fields.siteTitle,
    siteSettingModel.fields.siteAbout
  );
  return {
    title: {
      default: data[siteSettingModel.fields.siteTitle],
      template: '%s | ' + data[siteSettingModel.fields.siteTitle]
    },
    description: data[siteSettingModel.fields.siteAbout],
  };
}

export default async function RootLayout({ children }) {
  const faviconUrl = await getFavicon();
  return (
    <html lang='en' className='dark'>
      <head>
        <link rel='icon' href={_.isEmpty(faviconUrl) ? '/favicon.ico' : faviconUrl} />
      </head>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        {children}
      </body>
    </html>
  )
}
