import CategoryInfo from '@/components/category-info';
import CategoryList from '@/components/category-list';
import DiscussionList from '@/components/discussion-list';
import UserActions from '@/components/user-actions';

export default async function Page({ params }) {
  return (
    <div className='flex w-full min-h-screen gap-6 mt-6'>
      {/* main container*/}
      <div className='flex flex-col flex-1'>
        <DiscussionList />
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        <CategoryInfo slug={params.slug} />
        <UserActions category={null} />
        <CategoryList />
      </div>
    </div>
  )
}