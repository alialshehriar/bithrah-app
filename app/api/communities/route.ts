import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities } from '@/lib/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = db.select().from(communities);
    
    if (category && category !== 'all') {
      query = query.where(eq(communities.category, category));
    }
    
    if (search) {
      query = query.where(like(communities.name, `%${search}%`));
    }
    
    const result = await query.orderBy(desc(communities.memberCount));
    
    return NextResponse.json({ communities: result });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'خطأ في جلب المجتمعات' }, { status: 500 });
  }
}
