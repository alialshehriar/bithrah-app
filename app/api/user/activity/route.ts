import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { transactions, backings, projects } from '@/lib/db/schema';
import { eq, desc, or, sql } from 'drizzle-orm';

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
    const activities: any[] = [];

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: [desc(transactions.createdAt)],
      limit: 5,
    });

    recentTransactions.forEach(transaction => {
      activities.push({
        id: `transaction-${transaction.id}`,
        type: 'transaction',
        action: transaction.type,
        description: getTransactionDescription(transaction.type),
        amount: transaction.amount,
        timestamp: transaction.createdAt,
        icon: getTransactionIcon(transaction.type),
        color: getTransactionColor(transaction.type),
      });
    });

    // Get recent backings
    const recentInvestments = await db.query.backings.findMany({
      where: eq(backings.investorId, userId),
      orderBy: [desc(backings.createdAt)],
      limit: 5,
      with: {
        project: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    recentInvestments.forEach(investment => {
      activities.push({
        id: `investment-${investment.id}`,
        type: 'investment',
        action: 'invested',
        description: `استثمرت في مشروع ${investment.project?.title || 'غير معروف'}`,
        amount: investment.amount,
        timestamp: investment.createdAt,
        icon: 'DollarSign',
        color: 'green',
        projectId: investment.projectId,
      });
    });

    // Get recent project updates
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.creatorId, userId),
      orderBy: [desc(projects.updatedAt)],
      limit: 5,
    });

    userProjects.forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        type: 'project',
        action: 'updated',
        description: `تم تحديث مشروع ${project.title}`,
        timestamp: project.updatedAt,
        icon: 'Briefcase',
        color: 'blue',
        projectId: project.id,
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return top 10 most recent activities
    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 10),
    });
  } catch (error) {
    console.error('User activity error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب النشاطات' },
      { status: 500 }
    );
  }
}

function getTransactionDescription(type: string): string {
  const descriptions: Record<string, string> = {
    deposit: 'إيداع في المحفظة',
    withdrawal: 'سحب من المحفظة',
    investment: 'استثمار في مشروع',
    investment_return: 'عائد من استثمار',
    referral_bonus: 'مكافأة إحالة',
    reward: 'مكافأة',
  };
  return descriptions[type] || type;
}

function getTransactionIcon(type: string): string {
  const icons: Record<string, string> = {
    deposit: 'ArrowDownRight',
    withdrawal: 'ArrowUpRight',
    investment: 'DollarSign',
    investment_return: 'TrendingUp',
    referral_bonus: 'Gift',
    reward: 'Award',
  };
  return icons[type] || 'Activity';
}

function getTransactionColor(type: string): string {
  const colors: Record<string, string> = {
    deposit: 'green',
    withdrawal: 'red',
    investment: 'blue',
    investment_return: 'green',
    referral_bonus: 'purple',
    reward: 'yellow',
  };
  return colors[type] || 'gray';
}

