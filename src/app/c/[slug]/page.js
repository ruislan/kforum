import CategoryInfo from '@/components/category/category-info';
import CategoryList from '@/components/category/category-list';
import DiscussionList from '@/components/discussion/discussion-list';
import UserActions from '@/components/user/user-actions';
import prisma from '@/lib/prisma';

async function getCategory(slug) {
  const category = await prisma.category.findUnique({ where: {slug}});
  return category;
}

export default async function Page({ params }) {
  const category = await getCategory(params.slug);
  return (
    <div className='flex w-full h-full gap-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1 w-max-[680px]'>
        <DiscussionList />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <CategoryInfo category={category} />
        <UserActions category={category} />
        <CategoryList />
      </div>
    </div>
  )
}
