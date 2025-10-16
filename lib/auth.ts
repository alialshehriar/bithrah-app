import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1';

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  avatar?: string | null;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const sessionData: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };

  const token = jwt.sign(sessionData, JWT_SECRET, {
    expiresIn: '7d',
  });

  const cookieStore = await cookies();
  cookieStore.set('bithrah-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return sessionData;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete('bithrah-token');
}

