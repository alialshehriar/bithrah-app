import { NextRequest, NextResponse } from 'next/server';
import { sandboxStats } from '@/lib/sandbox/data';

// GET: Get sandbox status
export async function GET(request: NextRequest) {
  try {
    const sandboxMode = request.cookies.get('sandbox-mode')?.value === 'true';

    return NextResponse.json({
      success: true,
      isActive: sandboxMode,
      stats: sandboxMode ? sandboxStats : null,
    });
  } catch (error) {
    console.error('Error fetching sandbox status:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// POST: Toggle sandbox mode
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const response = NextResponse.json({
      success: true,
      message: action === 'enable' ? 'تم تفعيل وضع Sandbox' : 'تم إيقاف وضع Sandbox',
      isActive: action === 'enable',
    });

    // Set or remove sandbox cookie
    if (action === 'enable') {
      response.cookies.set('sandbox-mode', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    } else if (action === 'disable') {
      response.cookies.delete('sandbox-mode');
    } else {
      return NextResponse.json(
        { success: false, error: 'إجراء غير صالح' },
        { status: 400 }
      );
    }

    return response;
  } catch (error) {
    console.error('Error toggling sandbox mode:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

