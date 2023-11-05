import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import SideNav from '@/components/settings/side-nav';
import authOptions from '@/lib/auth';
import GeneralForm from '@/components/settings/general-form';
import Box from '@/components/ui/box';
import ProfileForm from '@/components/settings/profile-form';
import SecurityForm from '@/components/settings/security-form';
import AvatarUploader from '@/components/settings/avatar-uploader';
import { userModel } from '@/lib/models';
import { HeadingSmall } from '@/components/ui/heading';

const menus = [
  { label: '基本', path: '/settings' },
  { label: '个性化', path: '/settings/profile' },
  { label: '安全', path: '/settings/security' },
];

export const dynamic = 'force-dynamic'; // no cache for this page

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  const user = await userModel.getUser({ id: session.user?.id });
  if (!user) redirect('/');

  return (
    <div className='flex w-full min-h-screen gap-6'>
      {/* left side menus */}
      <div className='flex flex-col w-80 gap-4'>
        <SideNav menus={menus} />
      </div>
      {/* main container*/}
      <div className='flex flex-col flex-1'>
        {params.slug === 'general' && (
          <Box className='flex flex-col'>
            <HeadingSmall>账号信息</HeadingSmall>
            <GeneralForm user={user} />
          </Box>)}
        {params.slug === 'profile' && (
          <div className='flex flex-col gap-4'>
            <Box className='flex flex-col'>
              <HeadingSmall>图形图像</HeadingSmall>
              <AvatarUploader user={user} />
            </Box>
            <Box className='flex flex-col'>
              <HeadingSmall>概要信息</HeadingSmall>
              <ProfileForm user={user} />
            </Box>
          </div>
        )}
        {params.slug === 'security' &&
          <Box className='flex flex-col'>
            <HeadingSmall>更改密码</HeadingSmall>
            <SecurityForm />
          </Box>
        }
      </div>
    </div>
  )
}