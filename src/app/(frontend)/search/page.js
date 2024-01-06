import dynamicImport from 'next/dynamic';

const SearchTabs = dynamicImport(() => import('@/components/search/search-tabs'));

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: `搜索`,
  };
}

export default async function Page() {
  return (
    <div className='flex flex-col w-full h-full'>
        <SearchTabs />
    </div>
  )
}
