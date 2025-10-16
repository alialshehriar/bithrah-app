import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, interests } = body;

    // Validate username if provided
    if (username) {
      // Check if username is already taken
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });

      if (existingUser && existingUser.id !== parseInt(session.user.id)) {
        return NextResponse.json(
          { error: 'اسم المستخدم مستخدم بالفعل' },
          { status: 400 }
        );
      }
    }

    // Update user with onboarding data
    const updateData: any = {
      onboardingCompleted: true,
      updatedAt: new Date(),
    };

    if (username) {
      updateData.username = username;
    }

    if (interests && interests.length > 0) {
      updateData.preferences = {
        interests,
      };
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(session.user.id)));

    return NextResponse.json({
      success: true,
      message: 'تم إكمال التعريف بنجاح',
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إكمال التعريف' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(session.user.id)),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      username: user.username,
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

