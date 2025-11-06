import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportPackages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);

    const packages = await db
      .select()
      .from(supportPackages)
      .where(eq(supportPackages.projectId, projectId))
      .orderBy(asc(supportPackages.amount));

    return NextResponse.json({
      success: true,
      packages,
    });

  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الباقات' },
      { status: 500 }
    );
  }
}

