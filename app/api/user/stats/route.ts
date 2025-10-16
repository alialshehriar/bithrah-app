import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects, backings, wallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data since we don't have auth working yet
    return NextResponse.json({
      totalProjects: 0,
      activeProjects: 0,
      totalBackings: 0,
      totalInvested: 0,
      walletBalance: 0,
      level: 1,
      points: 0,
      experience: 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

