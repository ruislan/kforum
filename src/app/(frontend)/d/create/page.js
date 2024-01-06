import dynamicImport from 'next/dynamic';

import { categoryModel } from '@/models';

const DiscussionCreator = dynamicImport(() => import('@/components/discussion/discussion-creator'));
const Suggests = dynamicImport(() => import('@/components/discussion/suggests'));

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: `发布话题`,
  };
}

export default async function Page({ searchParams }) {
  const categories = await categoryModel.getCategories();
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 gap-2'>
        <DiscussionCreator categories={categories} initCategorySlug={searchParams.c} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* step list */}
        <Suggests />
      </div>
    </div>
  )
}
