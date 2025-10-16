import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'الرجاء إدخال الاسم والبريد الإلكتروني' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let user;

    if (existingUsers.length > 0) {
      // User exists - just use it
      user = existingUsers[0];
    } else {
      // Create new user with auto-generated password
      const autoPassword = 'quick_' + Math.random().toString(36).substring(2, 15);
      
      const newUsers = await db
        .insert(users)
        .values({
          email,
          password: autoPassword,
          name: name,
          username: email.split('@')[0] + '_' + Date.now(),
          emailVerified: true,
        } as any)
        .returning();

      user = newUsers[0];
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Quick entry error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ، الرجاء المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}

