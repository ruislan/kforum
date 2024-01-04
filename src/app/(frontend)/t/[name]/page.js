import dynamic from 'next/dynamic';

import { tagModel, discussionModel } from '@/models';
import { notFound } from 'next/navigation';
import Box from '@/components/ui/box';
import { DISCUSSION_SORT } from '@/lib/constants';

const SortPanel = dynamic(() => import('@/components/discussion/sort-panel'));
const TagInfo = dynamic(() => import('@/components/tags/tag-info'));
const DiscussionList = dynamic(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));
const ModeratorBox = dynamic(() => import('@/components/user/moderator-box'));

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
        <div className='flex w-full h-full gap-6'>
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
            <div className='flex flex-col w-80 gap-4'>
                <TagInfo tag={tag} />
                <Box className='flex flex-col gap-3'><ActionCreate /></Box>
                <CategoryBox />
                <ModeratorBox />
            </div>
        </div>
    )
}
