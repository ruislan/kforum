import { categoryModel, discussionModel } from '@/lib/models';
import CategoryInfo from '@/components/category/category-info';
import CategoryList from '@/components/category/category-list';
import DiscussionList from '@/components/discussion/discussion-list';
import ActionCreate from '@/components/discussion/action-create';
import Box from '@/components/ui/box';

async function getCategory(slug) {
  return await categoryModel.getCategory({ slug, withStats: true });
}

async function getDiscussions(categoryId) {
  return await discussionModel.getDiscussions({
    categoryId,
    withFirstPost: true,
    isStickyFirst: true
  });
}

export default async function Page({ params }) {
  const category = await getCategory(params.slug);
  const { discussions, hasMore } = await getDiscussions(category.id);
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 w-[680px] w-max-[680px]'>
        <DiscussionList
          categoryId={category.id}
          discussions={discussions}
          hasMore={hasMore}
          isStickyFirst={true}
        />
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
