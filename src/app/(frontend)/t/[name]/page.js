import dynamicImport from 'next/dynamic';

import { tagModel, discussionModel } from '@/models';
import { notFound } from 'next/navigation';
import Box from '@/components/ui/box';
import { DISCUSSION_SORT } from '@/lib/constants';

const SortPanel = dynamicImport(() => import('@/components/discussion/sort-panel'));
const TagInfo = dynamicImport(() => import('@/components/tags/tag-info'));
const DiscussionList = dynamicImport(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamicImport(() => import('@/components/category/category-box'));
const ActionCreate = dynamicImport(() => import('@/components/discussion/action-create'));
const ModeratorBox = dynamicImport(() => import('@/components/user/moderator-box'));

async function getTag(name) {
    return await tagModel.getTag({ name, withStats: true });
}

async function getDiscussions(tagId, sort) {
    return await discussionModel.getDiscussions({
        tagId,
        sort,
        withFirstPost: true,
        isStickyFirst: true // tag 也是置顶帖在上面
    });
}

export async function generateMetadata({ params, searchParams }, parent) {
    return {
        title: decodeURIComponent(params.name),
    };
}

export default async function Page({ params, searchParams }) {
    const tag = await getTag(decodeURIComponent(params.name));
    if (!tag) notFound();
    const sort = searchParams.sort || DISCUSSION_SORT[0];
    const { discussions, hasMore } = await getDiscussions(tag.id, sort);
    return (
        <div className='flex md:flex-row flex-col w-full h-full gap-6'>
            {/* main container*/}
            <div className='flex flex-col flex-1'>
                <SortPanel />
                <DiscussionList
                    tagId={tag.id}
                    discussions={discussions}
                    hasMore={hasMore}
                />
            </div>
            {/* right side */}
            <div className='flex flex-col md:w-80 w-full gap-4'>
                <TagInfo tag={tag} />
                <Box className='flex flex-col gap-3'><ActionCreate /></Box>
                <CategoryBox />
                <ModeratorBox />
            </div>
        </div>
    )
}
