import { categoryModel } from '@/lib/models';
import Box from '@/components/ui/box';
import DiscussionCreator from '@/components/discussion/discussion-creator';

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
        <Box className='flex flex-col text-sm font-mono'>
          <h3 className='text-sm text-gray-400 font-bold mb-3'>建议</h3>
          <span>1.阅读我们的社区规则</span>
          <span>2.请使用文明用语</span>
          <span>3.做真实率真的自己</span>
          <span>4.尊重原创</span>
          <span>5.发布前搜索内容，避免发布相同内容</span>
          <span>6.避免政治话题</span>
          <span>7.避免色情、赌博等不良话题</span>
          <span>8.避免伤风败俗、违背道德等话题</span>
          <span>9.避免非法话题</span>
        </Box>
      </div>
    </div>
  )
}
