import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, projects, backings, wallets, transactions } from '@/lib/db/schema';
import { eq, sql, and, gte, desc } from 'drizzle-orm';

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

    // Get projects count and stats
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.creatorId, userId),
    });

    const projectsStats = {
      total: userProjects.length,
      active: userProjects.filter(p => p.status === 'active').length,
      funded: userProjects.filter(p => p.status === 'funded').length,
      completed: userProjects.filter(p => p.status === 'completed').length,
      totalFunding: userProjects.reduce((sum, p) => sum + parseFloat(p.currentFunding || '0'), 0),
      totalGoal: userProjects.reduce((sum, p) => sum + parseFloat(p.fundingGoal), 0),
    };

    // Get backings count and stats
    const userInvestments = await db.query.backings.findMany({
      where: eq(backings.investorId, userId),
    });

    const backingsStats = {
      total: userInvestments.length,
      active: userInvestments.filter(i => i.status === 'active').length,
      totalAmount: userInvestments.reduce((sum, i) => sum + parseFloat(i.amount), 0),
      totalReturns: userInvestments.reduce((sum, i) => sum + parseFloat(i.returns || '0'), 0),
    };

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: [desc(transactions.createdAt)],
      limit: 10,
    });

    // Calculate monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await db
      .select({
        month: sql<string>`TO_CHAR(${transactions.createdAt}, 'YYYY-MM')`,
        income: sql<number>`SUM(CASE WHEN ${transactions.type} = 'deposit' OR ${transactions.type} = 'investment_return' THEN ${transactions.amount} ELSE 0 END)`,
        expenses: sql<number>`SUM(CASE WHEN ${transactions.type} = 'withdrawal' OR ${transactions.type} = 'investment' THEN ${transactions.amount} ELSE 0 END)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.createdAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`TO_CHAR(${transactions.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${transactions.createdAt}, 'YYYY-MM')`);

    // Calculate growth rate
    const lastMonthTransactions = recentTransactions.filter(t => {
      const transDate = new Date(t.createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return transDate >= lastMonth;
    });

    const previousMonthTransactions = recentTransactions.filter(t => {
      const transDate = new Date(t.createdAt);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return transDate >= twoMonthsAgo && transDate < lastMonth;
    });

    const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const previousMonthTotal = previousMonthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const growthRate = previousMonthTotal > 0 
      ? ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        user: {
          level: user.level,
          points: user.points,
          experience: user.experience,
          subscriptionTier: user.subscriptionTier,
        },
        wallet: {
          balance: wallet?.balance || '0',
          pendingBalance: wallet?.pendingBalance || '0',
        },
        projects: projectsStats,
        backings: backingsStats,
        transactions: {
          recent: recentTransactions,
          monthly: monthlyData,
        },
        growth: {
          rate: growthRate,
          lastMonth: lastMonthTotal,
          previousMonth: previousMonthTotal,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

