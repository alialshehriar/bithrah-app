import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const events = [
      {
        id: 1,
        title: 'ملتقى رواد الأعمال 2025',
        description: 'ملتقى سنوي يجمع رواد الأعمال والمستثمرين',
        date: '2025-05-15',
        location: 'الرياض، السعودية',
        attendees: 250,
        image: '/events/event1.jpg',
        category: 'networking',
      },
      {
        id: 2,
        title: 'ورشة عمل: التمويل الجماعي',
        description: 'تعلم كيفية إطلاق حملة تمويل جماعي ناجحة',
        date: '2025-05-20',
        location: 'جدة، السعودية',
        attendees: 100,
        image: '/events/event2.jpg',
        category: 'workshop',
      },
    ];
    
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في جلب الفعاليات' }, { status: 500 });
  }
}
