import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'bithrah-secret-2025';

// GET - Get walkthrough status
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const sql = neon(process.env.DATABASE_URL!);
    
    // Get user walkthrough status
    const users = await sql`
      SELECT walkthrough_completed, walkthrough_step
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      success: true,
      completed: user.walkthrough_completed || false,
      step: user.walkthrough_step || 0,
    });
  } catch (error) {
    console.error('Error fetching walkthrough status:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب حالة الجولة التعريفية' },
      { status: 500 }
    );
  }
}

// POST - Update walkthrough status
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const body = await request.json();
    const { completed, step } = body;

    const sql = neon(process.env.DATABASE_URL!);

    if (completed !== undefined) {
      // Mark walkthrough as completed
      await sql`
        UPDATE users
        SET walkthrough_completed = ${completed},
            walkthrough_step = ${completed ? 6 : 0},
            updated_at = NOW()
        WHERE id = ${userId}
      `;
    } else if (step !== undefined) {
      // Update current step
      await sql`
        UPDATE users
        SET walkthrough_step = ${step},
            updated_at = NOW()
        WHERE id = ${userId}
      `;
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الجولة التعريفية',
    });
  } catch (error) {
    console.error('Error updating walkthrough status:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث حالة الجولة التعريفية' },
      { status: 500 }
    );
  }
}

