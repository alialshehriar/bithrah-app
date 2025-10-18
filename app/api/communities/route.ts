import { NextRequest, NextResponse } from 'next/server';

// Sandbox communities data
const sandboxCommunities = [
  {
    id: '1',
    name: 'مجتمع التقنية والابتكار',
    description: 'مجتمع متخصص في التقنية والابتكار وريادة الأعمال التقنية',
    icon: '💻',
    members: 2547,
    posts: 450,
    category: 'تقنية',
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'مجتمع الصحة والطب',
    description: 'مجتمع للمهتمين بالصحة والطب والابتكارات الطبية',
    icon: '🏥',
    members: 1823,
    posts: 320,
    category: 'صحة',
    isActive: true,
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '3',
    name: 'مجتمع التعليم والتدريب',
    description: 'مجتمع متخصص في التعليم والتدريب والتطوير المهني',
    icon: '📚',
    members: 3421,
    posts: 580,
    category: 'تعليم',
    isActive: true,
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '4',
    name: 'مجتمع الطاقة المتجددة',
    description: 'مجتمع للمهتمين بالطاقة المتجددة والاستدامة البيئية',
    icon: '⚡',
    members: 1654,
    posts: 280,
    category: 'طاقة',
    isActive: true,
    createdAt: new Date('2024-02-10').toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const sandboxMode = request.cookies.get('sandbox-mode')?.value === 'true';
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (sandboxMode) {
      return NextResponse.json({
        success: true,
        communities: sandboxCommunities.slice(0, limit),
        total: sandboxCommunities.length,
      });
    }

    const { db } = await import('@/lib/db');
    const { communities } = await import('@/lib/db/schema');
    const { desc } = await import('drizzle-orm');

    const result = await db
      .select()
      .from(communities)
      .orderBy(desc(communities.memberCount))
      .limit(limit);

    return NextResponse.json({
      success: true,
      communities: result.map(c => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description,
        icon: c.image || '👥',
        members: c.memberCount || 0,
        posts: c.postsCount || 0,
        category: c.category || 'عام',
        isActive: c.status === 'active',
        createdAt: c.createdAt,
      })),
      total: result.length,
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المجتمعات' },
      { status: 500 }
    );
  }
}
