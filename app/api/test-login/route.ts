import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Testing login for:', email);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found', success: false });
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      hasPassword: !!user.password,
    });

    if (!user.password) {
      return NextResponse.json({ error: 'No password set', success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password', success: false });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({ error: 'Server error', success: false }, { status: 500 });
  }
}

