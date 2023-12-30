import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import prisma from '@/lib/prisma';
import rest from '@/lib/rest';

export async function GET(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    const fetchStatsAdmins = prisma.user.count({ where: { isAdmin: true } });
    const fetchStatsUsers = prisma.user.count();
    const fetchStatsDiscussions = prisma.discussion.count({ where: { deletedAt: null } });
    const fetchStatsPosts = prisma.post.count({ where: { deletedAt: null } });
    const fetchStatsReactions = prisma.reactionPostRef.count();
    const fetchStatsUploads = prisma.upload.count();
    const fetchStatsReports = prisma.report.count();
    const [admins, users, discussions, posts, reactions, uploads, reports] = await Promise.all([
        fetchStatsAdmins,
        fetchStatsUsers,
        fetchStatsDiscussions,
        fetchStatsPosts,
        fetchStatsReactions,
        fetchStatsUploads,
        fetchStatsReports,
    ]);
    const data = { admins, users, discussions, posts, reactions, uploads, reports };
    return rest.ok({ data });
}