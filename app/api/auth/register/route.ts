import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/auth';

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

    // Create user with only required fields
    const insertData: any = {
      email,
      password: hashedPassword,
    };
    
    // Add optional fields if provided
    if (name) {
      insertData.name = name;
    }
    
    const [newUser] = await db
      .insert(users)
      .values(insertData)
      .returning();

    // Create session automatically (auto-login)
    await createSession(newUser.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    // Return success with redirect instruction
    const response = NextResponse.json(
      {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: userWithoutPassword,
        redirect: '/home',
      },
      { status: 201 }
    );
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}

