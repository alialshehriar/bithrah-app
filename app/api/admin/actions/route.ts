import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, projects, communities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Check if admin
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مسؤولاً' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, targetType, targetId, data } = body;

    let result: any = {};

    switch (action) {
      case 'approve_project':
        // @ts-ignore - status field exists in database
        await db.update(projects)
          .set({ status: 'active' })
          .where(eq(projects.id, targetId));
        result = { message: 'تم الموافقة على المشروع' };
        break;

      case 'reject_project':
        // @ts-ignore - status field exists in database
        await db.update(projects)
          .set({ status: 'rejected' })
          .where(eq(projects.id, targetId));
        result = { message: 'تم رفض المشروع' };
        break;

      case 'suspend_user':
        await db.update(users)
          .set({ status: 'suspended', updatedAt: new Date() })
          .where(eq(users.id, targetId));
        result = { message: 'تم تعليق المستخدم' };
        break;

      case 'activate_user':
        await db.update(users)
          .set({ status: 'active', updatedAt: new Date() })
          .where(eq(users.id, targetId));
        result = { message: 'تم تفعيل المستخدم' };
        break;

      case 'ban_user':
        await db.update(users)
          .set({ status: 'banned', updatedAt: new Date() })
          .where(eq(users.id, targetId));
        result = { message: 'تم حظر المستخدم' };
        break;

      case 'make_admin':
        await db.update(users)
          .set({ role: 'admin', updatedAt: new Date() })
          .where(eq(users.id, targetId));
        result = { message: 'تم ترقية المستخدم لمسؤول' };
        break;

      case 'remove_admin':
        await db.update(users)
          .set({ role: 'user', updatedAt: new Date() })
          .where(eq(users.id, targetId));
        result = { message: 'تم إزالة صلاحيات المسؤول' };
        break;

      case 'update_subscription':
        await db.update(users)
          .set({ 
            subscriptionTier: data.tier,
            subscriptionStatus: data.status,
            subscriptionEndDate: data.endDate ? new Date(data.endDate) : null,
            updatedAt: new Date()
          })
          .where(eq(users.id, targetId));
        result = { message: 'تم تحديث الاشتراك' };
        break;

      case 'delete_project':
        await db.delete(projects).where(eq(projects.id, targetId));
        result = { message: 'تم حذف المشروع' };
        break;

      case 'delete_community':
        await db.delete(communities).where(eq(communities.id, targetId));
        result = { message: 'تم حذف المجتمع' };
        break;

      case 'feature_project':
        await db.update(projects)
          .set({ featured: true, updatedAt: new Date() })
          .where(eq(projects.id, targetId));
        result = { message: 'تم تمييز المشروع' };
        break;

      case 'unfeature_project':
        await db.update(projects)
          .set({ featured: false, updatedAt: new Date() })
          .where(eq(projects.id, targetId));
        result = { message: 'تم إلغاء تمييز المشروع' };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'إجراء غير معروف' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error performing admin action:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
