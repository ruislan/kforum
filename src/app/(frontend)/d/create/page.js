import { categoryModel } from '@/lib/models';
import Box from '@/components/ui/box';
import DiscussionCreator from '@/components/discussion/discussion-creator';

export default async function Page({ searchParams }) {
  const categories = await categoryModel.getCategories();
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container */}
      <div className='flex flex-col flex-1 w-max-[680px] gap-2'>
        <DiscussionCreator categories={categories} initCategorySlug={searchParams.c} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* step list */}
        <Box className='flex flex-col text-sm'>
          <span>1.Posting to Reddit</span>
          <span>2.Remember the human</span>
          <span>3.Behave like you would in real life</span>
          <span>4.Look for the original source of content</span>
          <span>5.Search for duplicates before posting</span>
          <span>6.Read the community’s rules</span>
        </Box>
      </div>
    </div>
  )
}
