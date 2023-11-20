import './globals.css';
import { siteSettingModel } from '@/lib/models';

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
  return (
    <html lang='en' className='dark'>
      <body className='antialiased w-full h-full max-w-full m-0 p-0'>
        {children}
      </body>
    </html>
  )
}
