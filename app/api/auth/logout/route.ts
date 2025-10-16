import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await destroySession();
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

