import SideNav from "@/components/settings/side-nav";

const menus = [
  { label: '基本', path: '/settings' },
  { label: '个性化', path: '/settings/profile' },
  { label: '安全', path: '/settings/security' },
];

export default async function Page({ children }) {
  return (
    <div className='flex w-full min-h-screen gap-6'>
      {/* left side menus */}
      <div className='flex flex-col w-80 gap-4'>
        <SideNav menus={menus} />
      </div>
      {/* main container*/}
      <div className='flex flex-col w-[680px]'>
        {children}
      </div>
    </div>
  )
}
