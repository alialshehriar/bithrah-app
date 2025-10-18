import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities } from '@/lib/db/schema';
import { eq, like, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const conditions = [];
    
    if (category && category !== 'all') {
      conditions.push(eq(communities.category, category));
    }
    
    if (search) {
      conditions.push(like(communities.name, `%${search}%`));
    }
    
    const result = conditions.length > 0
      ? await db.select().from(communities).where(and(...conditions)).orderBy(desc(communities.memberCount))
      : await db.select().from(communities).orderBy(desc(communities.memberCount));
    
    return NextResponse.json({ communities: result });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'خطأ في جلب المجتمعات' }, { status: 500 });
  }
}

