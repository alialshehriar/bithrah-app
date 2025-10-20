import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    // تنفيذ سكريبت التنظيف وإعادة البناء
    await db.execute(sql`
      -- حذف البيانات المرتبطة
      DELETE FROM community_posts WHERE is_demo = true;
      DELETE FROM community_members WHERE is_demo = true;
      DELETE FROM event_registrations WHERE is_demo = true;
      DELETE FROM project_updates WHERE is_demo = true;
      DELETE FROM backings WHERE is_demo = true;
      DELETE FROM evaluations WHERE is_demo = true;
      DELETE FROM transactions WHERE is_demo = true;
      DELETE FROM wallets WHERE user_id IN (SELECT id FROM users WHERE is_demo = true);
      
      -- حذف الجداول الرئيسية
      DELETE FROM projects WHERE is_demo = true;
      DELETE FROM communities WHERE is_demo = true;
      DELETE FROM events WHERE is_demo = true;
      DELETE FROM leaderboard WHERE is_demo = true;
      DELETE FROM users WHERE is_demo = true;
    `);

    return NextResponse.json({
      success: true,
      message: 'تم تنظيف البيانات بنجاح'
    });
  } catch (error) {
    console.error('Error rebuilding demo data:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تنظيف البيانات' },
      { status: 500 }
    );
  }
}

