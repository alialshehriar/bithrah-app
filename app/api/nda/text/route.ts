import { NextRequest, NextResponse } from 'next/server';
import { getNDAText } from '@/lib/access-control';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'platform') as 'platform' | 'project';
    
    const text = getNDAText(type);
    
    return NextResponse.json({
      success: true,
      text,
      version: '1.0',
      type,
    });
    
  } catch (error: any) {
    console.error('Error getting NDA text:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب نص الاتفاقية', details: error.message },
      { status: 500 }
    );
  }
}

