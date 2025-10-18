import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

// GET: Get sandbox status and stats
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مديراً' },
        { status: 403 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Get sandbox data counts
    const usersResult = await sql`
      SELECT COUNT(*) as count
      FROM users
      WHERE is_sandbox = true
    `;

    const projectsResult = await sql`
      SELECT COUNT(*) as count
      FROM projects
      WHERE is_sandbox = true
    `;

    const communitiesResult = await sql`
      SELECT COUNT(*) as count
      FROM communities
      WHERE is_sandbox = true
    `;

    const eventsResult = await sql`
      SELECT COUNT(*) as count
      FROM events
      WHERE is_sandbox = true
    `;

    const stats = {
      users: parseInt(usersResult[0].count),
      projects: parseInt(projectsResult[0].count),
      communities: parseInt(communitiesResult[0].count),
      events: parseInt(eventsResult[0].count),
    };

    const isActive = stats.users > 0 || stats.projects > 0 || stats.communities > 0 || stats.events > 0;

    return NextResponse.json({
      success: true,
      isActive,
      stats,
    });
  } catch (error) {
    console.error('Error fetching sandbox status:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// POST: Generate or delete sandbox data
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مديراً' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    const sql = neon(process.env.DATABASE_URL!);

    if (action === 'generate') {
      // Generate sandbox data
      const bcrypt = require('bcryptjs');
      
      // Create sandbox users
      const sandboxUsers = [
        { name: 'أحمد السعيد', email: 'ahmed@sandbox.test', password: await bcrypt.hash('password123', 10) },
        { name: 'فاطمة النور', email: 'fatima@sandbox.test', password: await bcrypt.hash('password123', 10) },
        { name: 'محمد الخير', email: 'mohammed@sandbox.test', password: await bcrypt.hash('password123', 10) },
        { name: 'نورة الأمل', email: 'nora@sandbox.test', password: await bcrypt.hash('password123', 10) },
        { name: 'خالد النجاح', email: 'khaled@sandbox.test', password: await bcrypt.hash('password123', 10) },
      ];

      for (const user of sandboxUsers) {
        await sql`
          INSERT INTO users (name, email, password, role, is_sandbox)
          VALUES (${user.name}, ${user.email}, ${user.password}, 'user', true)
          ON CONFLICT (email) DO NOTHING
        `;
      }

      // Get first sandbox user for creating projects
      const firstUser = await sql`
        SELECT id FROM users WHERE is_sandbox = true LIMIT 1
      `;

      if (firstUser.length > 0) {
        const userId = firstUser[0].id;

        // Create sandbox projects
        const sandboxProjects = [
          {
            title: 'تطبيق توصيل ذكي',
            description: 'منصة توصيل مبتكرة تستخدم الذكاء الاصطناعي لتحسين تجربة التوصيل',
            category: 'technology',
            funding_goal: 500000,
            current_funding: 150000,
          },
          {
            title: 'مشروع زراعة عضوية',
            description: 'مزرعة عضوية مستدامة تنتج خضروات وفواكه طازجة',
            category: 'agriculture',
            funding_goal: 300000,
            current_funding: 80000,
          },
          {
            title: 'منصة تعليمية تفاعلية',
            description: 'منصة تعليم إلكتروني تفاعلية للطلاب في المرحلة الابتدائية',
            category: 'education',
            funding_goal: 400000,
            current_funding: 200000,
          },
        ];

        for (const project of sandboxProjects) {
          await sql`
            INSERT INTO projects (
              title, description, category, funding_goal, 
              current_funding, owner_id, status, is_sandbox
            )
            VALUES (
              ${project.title}, ${project.description}, ${project.category},
              ${project.funding_goal}, ${project.current_funding}, ${userId},
              'active', true
            )
          `;
        }

        // Create sandbox communities
        const sandboxCommunities = [
          { name: 'مجتمع رواد الأعمال', description: 'مجتمع لتبادل الخبرات بين رواد الأعمال' },
          { name: 'مجتمع المبتكرين', description: 'مجتمع للمبدعين والمبتكرين في مختلف المجالات' },
        ];

        for (const community of sandboxCommunities) {
          await sql`
            INSERT INTO communities (name, description, creator_id, is_sandbox)
            VALUES (${community.name}, ${community.description}, ${userId}, true)
          `;
        }

        // Create sandbox events
        const sandboxEvents = [
          {
            title: 'ملتقى رواد الأعمال 2025',
            description: 'ملتقى سنوي لرواد الأعمال والمستثمرين',
            date: new Date('2025-11-15'),
            location: 'الرياض',
          },
          {
            title: 'ورشة عمل: كيف تبدأ مشروعك',
            description: 'ورشة عمل تدريبية للمبتدئين في ريادة الأعمال',
            date: new Date('2025-10-25'),
            location: 'جدة',
          },
        ];

        for (const event of sandboxEvents) {
          await sql`
            INSERT INTO events (title, description, date, location, organizer_id, is_sandbox)
            VALUES (${event.title}, ${event.description}, ${event.date}, ${event.location}, ${userId}, true)
          `;
        }
      }

      return NextResponse.json({
        success: true,
        message: 'تم توليد البيانات الوهمية بنجاح',
      });
    } else if (action === 'clear') {
      // Delete all sandbox data
      await sql`DELETE FROM investments WHERE is_sandbox = true`;
      await sql`DELETE FROM events WHERE is_sandbox = true`;
      await sql`DELETE FROM communities WHERE is_sandbox = true`;
      await sql`DELETE FROM projects WHERE is_sandbox = true`;
      await sql`DELETE FROM users WHERE is_sandbox = true`;

      return NextResponse.json({
        success: true,
        message: 'تم حذف البيانات الوهمية بنجاح',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'إجراء غير صالح' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error managing sandbox data:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

