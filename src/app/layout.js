import _ from 'lodash';
import { siteSettingModel } from '@/lib/models';

import './globals.css';

async function getLogo() {
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
  const logoUrl = await getLogo();
  return (
    <html lang='en' className='dark'>
      <head>
        <link rel='icon' href={_.isEmpty(logoUrl) ? '/favicon.ico' : logoUrl} />
      </head>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        {children}
      </body>
    </html>
  )
}
