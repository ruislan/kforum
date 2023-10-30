import { categoryModel, discussionModel } from '@/lib/models';
import CategoryInfo from '@/components/category/category-info';
import CategoryList from '@/components/category/category-list';
import DiscussionList from '@/components/discussion/discussion-list';
import ActionCreate from '@/components/discussion/action-create';
import Box from '@/components/ui/box';

export default async function Page({ params }) {
  const fetchCategory = categoryModel.getCategory(params.slug);
  const fetchDiscussions = discussionModel.getDiscussions({ withFirstPost: true, isStickyFirst: true });
  const [category, { discussions, hasMore }] = await Promise.all([fetchCategory, fetchDiscussions]);
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 w-max-[680px]'>
        <DiscussionList discussions={discussions} hasMore={hasMore} />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <CategoryInfo category={category} />
        <Box className='flex flex-col gap-3'><ActionCreate category={category} /></Box>
        <CategoryList />
      </div>
    </div>
  )
}
