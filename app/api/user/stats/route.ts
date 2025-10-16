import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, projects, backings, wallets, referrals } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get wallet data
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    // Get projects stats
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.creatorId, userId),
    });

    const myProjects = userProjects.length;
    const totalFunding = userProjects.reduce((sum, p) => sum + parseFloat(p.currentFunding || '0'), 0);
    
    // Count total backers (unique investors across all projects)
    const projectIds = userProjects.map(p => p.id);
    let totalBackers = 0;
    if (projectIds.length > 0) {
      const backersResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${backings.investorId})` })
        .from(backings)
        .where(sql`${backings.projectId} IN (${sql.join(projectIds.map(id => sql`${id}`), sql`, `)})`);
      totalBackers = backersResult[0]?.count || 0;
    }

    // Get backings stats
    const userInvestments = await db.query.backings.findMany({
      where: eq(backings.investorId, userId),
    });

    // Get referral earnings
    const referralData = await db.query.referrals.findMany({
      where: eq(referrals.referrerId, userId),
    });
    const referralEarnings = referralData.reduce((sum, r) => sum + parseFloat(r.earnings || '0'), 0);

    // Calculate total views (sum of all project views)
    const totalViews = userProjects.reduce((sum, p) => sum + (p.views || 0), 0);

    // Calculate conversion rate (backers / views)
    const conversionRate = totalViews > 0 ? (totalBackers / totalViews) * 100 : 0;

    // Pending negotiations (projects with status 'negotiating')
    const pendingNegotiations = userProjects.filter(p => p.status === 'negotiating').length;

    return NextResponse.json({
      success: true,
      stats: {
        myProjects,
        totalBackers,
        totalFunding: totalFunding.toString(),
        pendingNegotiations,
        walletBalance: wallet?.balance || '0',
        referralEarnings: referralEarnings.toString(),
        level: user.level,
        points: user.points,
        experience: user.experience,
        totalViews,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

