import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      name,
      bio,
      city,
      country,
      phone,
      website,
      twitter,
      linkedin,
      github,
      instagram,
    } = await request.json();

    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set({
        name: name || null,
        bio: bio || null,
        city: city || null,
        country: country || null,
        phone: phone || null,
        website: website || null,
        twitter: twitter || null,
        linkedin: linkedin || null,
        github: github || null,
        instagram: instagram || null,
      } as any)
      .where(eq(users.id, parseInt(session.user.id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'فشل تحديث الملف الشخصي' },
      { status: 500 }
    );
  }
}
