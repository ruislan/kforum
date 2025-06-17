import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    // require admin or moderator
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin && !session?.user?.isModerator) return rest.notFound();

    const fetchStatsAdmins = prisma.user.count({ where: { isAdmin: true } });
    const fetchStatsModerators = prisma.user.count({ where: { isModerator: true } });
    const fetchStatsUsers = prisma.user.count();
    const fetchStatsDiscussions = prisma.discussion.count({ where: { deletedAt: null } });
    const fetchStatsPosts = prisma.post.count({ where: { deletedAt: null } });
    const fetchStatsReactions = prisma.reactionPostRef.count();
    const fetchStatsUploads = prisma.upload.count();
    const fetchStatsReports = prisma.report.count();
    const [admins, moderators, users, discussions, posts, reactions, uploads, reports] = await Promise.all([
        fetchStatsAdmins,
        fetchStatsModerators,
        fetchStatsUsers,
        fetchStatsDiscussions,
        fetchStatsPosts,
        fetchStatsReactions,
        fetchStatsUploads,
        fetchStatsReports,
    ]);
    const data = { admins, moderators, users, discussions, posts, reactions, uploads, reports };
    return rest.ok({ data });
}