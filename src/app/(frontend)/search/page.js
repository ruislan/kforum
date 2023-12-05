import SearchTabs from '@/components/search/search-tabs';

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: `搜索`, 
  };
}

export default async function Page() {
    return (
        <div className='flex w-full h-full gap-6'>
            <div className='flex flex-col flex-1'>
                <SearchTabs />
            </div>
            {/* right side filter */}
            {/* <div className='flex flex-col w-80 gap-4'>
            </div> */}
        </div>
    )
}
