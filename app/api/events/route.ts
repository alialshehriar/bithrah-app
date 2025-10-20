import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const sandboxEvents = [
  {
    id: '1',
    title: 'ورشة عمل: كيف تطلق مشروعك',
    description: 'ورشة عمل شاملة لتعليم رواد الأعمال كيفية إطلاق مشاريعهم بنجاح',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'أونلاين',
    attendees: 89,
    category: 'ورشة عمل',
    image: '/events/workshop.jpg',
  },
  {
    id: '2',
    title: 'لقاء المستثمرين الشهري',
    description: 'لقاء شهري يجمع المستثمرين ورواد الأعمال لمناقشة فرص الاستثمار',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'الرياض',
    attendees: 156,
    category: 'لقاء',
    image: '/events/investors.jpg',
  },
  {
    id: '3',
    title: 'مسابقة أفضل فكرة مشروع',
    description: 'مسابقة للمشاريع الناشئة للفوز بتمويل وجوائز قيمة',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'جدة',
    attendees: 234,
    category: 'مسابقة',
    image: '/events/competition.jpg',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const upcoming = searchParams.get('upcoming') === 'true';
    

    // Real data - return empty for now since events table doesn't exist
    return NextResponse.json({
      success: true,
      events: [],
      total: 0,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الفعاليات' },
      { status: 500 }
    );
  }
}
