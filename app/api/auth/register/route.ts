import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate username from email
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
    
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        username,
      })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'تم إنشاء الحساب بنجاح',
        user: userWithoutPassword,
        verificationToken: 'temp-token-' + newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}

