import dynamic from 'next/dynamic';

import { tagModel, discussionModel } from '@/lib/models';
import { notFound } from 'next/navigation';
import Box from '@/components/ui/box';

const TagInfo = dynamic(() => import('@/components/tags/tag-info'));
const DiscussionList = dynamic(() => import('@/components/discussion/discussion-list'));
const CategoryBox = dynamic(() => import('@/components/category/category-box'));
const ActionCreate = dynamic(() => import('@/components/discussion/action-create'));

async function getTag(name) {
    return await tagModel.getTag({ name, withStats: true });
}

async function getDiscussions(tagId) {
    return await discussionModel.getDiscussions({
        tagId,
        withFirstPost: true,
        isStickyFirst: true
    });
}

export async function generateMetadata({ params, searchParams }, parent) {
    return {
        title: decodeURIComponent(params.name),
    };
}

export default async function Page({ params }) {
    const tag = await getTag(decodeURIComponent(params.name));
    if (!tag) notFound();
    const { discussions, hasMore } = await getDiscussions(tag.id);
    return (
        <div className='flex w-full h-full gap-6'>
            {/* main container*/}
            <div className='flex flex-col flex-1'>
                <DiscussionList
                    discussions={discussions}
                    hasMore={hasMore}
                    isStickyFirst={true}
                />
            </div>
            {/* right side */}
            <div className='flex flex-col w-80 gap-4'>
                <TagInfo tag={tag} />
                <Box className='flex flex-col gap-3'><ActionCreate /></Box>
                <CategoryBox isSticky />
            </div>
        </div>
    )
}
