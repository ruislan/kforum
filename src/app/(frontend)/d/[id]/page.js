import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { bookmarkModel, discussionModel, postModel } from '@/models';
import Box from '@/components/ui/box';
import authOptions from '@/lib/auth';

const DiscussionDetail = dynamicImport(() => import('@/components/discussion/discussion-detail'));
const DiscussionDetailShareView = dynamicImport(() => import('@/components/discussion/discussion-detail-share-view'));
const DiscussionStats = dynamicImport(() => import('@/components/discussion/discussion-detail-stats'));
const CategoryBox = dynamicImport(() => import('@/components/category/category-box'));
const ModeratorBox = dynamicImport(() => import('@/components/user/moderator-box'));
const ActionCreate = dynamicImport(() => import('@/components/discussion/action-create'));
const BackToTop = dynamicImport(() => import('@/components/ui/back-to-top'));

export async function generateMetadata({ params, searchParams }, parent) {
    return {
        title: '话题',  // FIXME 如果在这里动态获取，则会和 Page 一起调用两次，后面来解决，现在就这样
    };
}

export default async function Page({ params, searchParams }) {
    const id = Number(params.id);
    const d = await discussionModel.getDiscussion({ id });
    if (!d) notFound();
    // we must assure the discussion exists
    await discussionModel.incrementView({ id: d.id });
    const session = await getServerSession(authOptions);
    if (!!session?.user) {
        // get user bookmark and user follow status
        const [bookmark, isFollowed] = await Promise.all([
            bookmarkModel.getBookmark({ userId: session.user.id, postId: d.firstPost.id }),
            discussionModel.isUserFollowed({ userId: session.user.id, discussionId: d.id })
        ]);
        d.firstPost.isBookmarked = !!bookmark;
        d.isFollowed = isFollowed;
    }
    let post = null;
    if (searchParams.postId && d.firstPost.id !== searchParams.postId) {
        post = await postModel.getPost({ id: Number(searchParams.postId) });
    }

    return (
        <div className='flex md:flex-row flex-col w-full h-full gap-6'>
            {/* main container */}
            <div className='flex flex-col md:flex-1 gap-2'>
                {post ?
                    <DiscussionDetailShareView discussion={d} post={post} /> :
                    <DiscussionDetail discussion={d} />
                }
            </div>
            {/* right side */}
            <div className='flex flex-col md:w-80 w-full gap-4'>
                <DiscussionStats discussion={d} />
                <Box className='flex flex-col gap-3'><ActionCreate /></Box>
                <CategoryBox />
                <ModeratorBox />
                <BackToTop />
            </div>
        </div>
    )
}
