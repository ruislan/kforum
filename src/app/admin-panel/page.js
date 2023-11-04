import SideNav from '@/components/settings/side-nav';
import Box from '@/components/ui/box';

const menus = [
  { label: '设置', path: '/admin-panel/site' },
  { label: '分类', path: '/admin-panel/categories' },
  { label: '用户', path: '/admin-panel/users' },
];

export default async function Page() {

  return (
    <div className='flex w-full h-full gap-6'>
      <div className='flex flex-col w-80 gap-4'>
        <SideNav menus={menus} />
      </div>
      <div className='flex flex-col flex-1'>
        <Box></Box>
      </div>
    </div>
  )
}
