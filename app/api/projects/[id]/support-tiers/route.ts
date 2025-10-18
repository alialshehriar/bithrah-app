import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTiers } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const projectId = parseInt((await params).id);
    
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    const tiers = await db
      .select()
      .from(supportTiers)
      .where(eq(supportTiers.projectId, projectId))
      .orderBy(asc(supportTiers.amount));
    
    return NextResponse.json({ tiers });
  } catch (error) {
    console.error('Error fetching support tiers:', error);
    return NextResponse.json({ error: 'خطأ في جلب باقات الدعم', tiers: [] }, { status: 500 });
  }
}

